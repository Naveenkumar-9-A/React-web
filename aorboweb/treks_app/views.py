from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.urls import reverse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.db.models import Q, Case, When, IntegerField
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone as dj_timezone
from datetime import datetime, timezone, timedelta
import difflib
import threading

from .models import (
    Contact, Blog, TrekCategory, Trek, 
    Testimonial, FAQ, SafetyTip, TeamMember,
    HomepageBanner, TrekList, SearchLog
)

def send_email_async(mail):
    threading.Thread(target=mail.send).start()


def get_featured_treks():
    cache_key = "featured_treks_qs"
    qs = cache.get(cache_key)

    if qs is not None:
        return qs

    qs = (
        TrekList.objects
        .prefetch_related('tags')
        .annotate(
            pin_order=Case(
                When(is_pinned=True, then=0),
                default=1,
                output_field=IntegerField()
            )
        )
        .order_by('pin_order', 'pin_priority', '-created_at')
    )

    cache.set(cache_key, qs, 60 * 10)  
    return qs


def get_trek_categories():
    cache_key = "trek_categories_all"
    categories = cache.get(cache_key)

    if categories is None:
        categories = TrekCategory.objects.all()
        cache.set(cache_key, categories, 60 * 60)

    return categories

def home(request):
    page_number = request.GET.get('page', 1)
    cache_key = f"home_page_{page_number}"
    cached_context = cache.get(cache_key)

    if cached_context:
        return render(request, 'index.html', cached_context)

    paginator = Paginator(get_featured_treks(), 8)
    page_obj = paginator.get_page(page_number)

    faq_categories = cache.get("faq_categories")
    if not faq_categories:
        faq_categories = {}
        for faq in FAQ.objects.all().order_by('category', 'order'):
            faq_categories.setdefault(faq.category, []).append(faq)
        cache.set("faq_categories", faq_categories, 60 * 60)

    context = {
        'featured_treks': page_obj.object_list,
        'page_obj': page_obj,
        'featured_testimonials': Testimonial.objects.filter(is_featured=True)[:6],
        'featured_blogs': Blog.objects.filter(is_featured=True)[:3],
        'banners': HomepageBanner.objects.filter(is_active=True).order_by('order'),
        'faq_categories': faq_categories,
    }

    cache.set(cache_key, context, 60 * 10)
    return render(request, 'index.html', context)


STOP_WORDS = {"best", "top", "places", "place", "near", "visit", "to", "trip", "trips", "treks", "trek"}

def normalize_text(text):
    return text.lower().strip()

def clean_query(query):
    return " ".join(w for w in normalize_text(query).split() if w not in STOP_WORDS)

def score_match(query, text):
    query, text = normalize_text(query), normalize_text(text)
    score = 0
    if text == query: score += 120
    if text.startswith(query): score += 100
    if any(w.startswith(query) for w in text.split()): score += 80
    if query in text: score += 60
    sim = difflib.SequenceMatcher(None, query, text).ratio()
    if sim > 0.6:
        score += int(sim * 40)
    return score

def typo_score(query, text):
    return int(difflib.SequenceMatcher(None, query, text).ratio() * 100)


def search_trek(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return redirect("home")

    cleaned_query = clean_query(query)
    if not cleaned_query:
        return redirect("home")

    treks = (
        TrekList.objects
        .filter(
            Q(name__icontains=cleaned_query) |
            Q(state__icontains=cleaned_query) |
            Q(tags__name__icontains=cleaned_query)
        )
        .distinct()[:50] 
    )

    ranked = sorted(treks, key=lambda t: score_match(cleaned_query, t.name), reverse=True)

    if ranked:
        return redirect("card_trek_detail", ranked[0].id)

    return redirect("home")



def search_suggestions(request):
    query = request.GET.get("q", "").strip()

    # To this — only log if query is 4+ characters
    if len(query) < 2:
        return JsonResponse({"results": []})

    # if len(query) >= 4:
    #     SearchLog.objects.create(query=query, ip_address=request.META.get('REMOTE_ADDR'))


    # Cache search suggestions for 30 minutes
    query_n = normalize_text(query)
    cache_key = f"search_suggestions_{query_n}"

    cached_results = cache.get(cache_key)
    if cached_results:
        return JsonResponse(cached_results)

    MAX_RESULTS = 8
    scored = []

    treks = (
        TrekList.objects
        .filter(name__istartswith=query_n)
        .only("id", "name", "state")[:30]
    )

    for trek in treks:
        name = trek.name or ""
        state = trek.state or ""
        score = 0

        if name.lower().startswith(query_n):
            score += 120

        for word in name.lower().split():
            if word.startswith(query_n):
                score += 90

        if score < 80:
            score = max(score, typo_score(query_n, name))

        if score < 60 and state:
            score = max(score, typo_score(query_n, state) - 10)

        if score >= 55:
            scored.append((score, trek))

    scored.sort(key=lambda x: x[0], reverse=True)

    results = []
    seen = set()

    for score, trek in scored[:MAX_RESULTS]:
        if trek.id in seen:
            continue

        results.append({
            "label": trek.name,
            "type": "trek",
            "url": reverse("card_trek_detail", args=[trek.id]),
        })
        seen.add(trek.id)

    if results:
        results.append({
            "label": f"Best treks near {query}",
            "type": "intent",
            "url": reverse("search_trek") + f"?q={query}",
        })

    response_data = {"results": results}
    cache.set(cache_key, response_data, 60 * 30) 
    return JsonResponse(response_data)

def about(request):
    """Render about page with cached team members."""
    cache_key = "about_page_team_members"
    team_members = cache.get(cache_key)
    
    if not team_members:
        team_members = TeamMember.objects.all().order_by('order')
        cache.set(cache_key, team_members, 60 * 60)  # 1 hour
    
    return render(request, 'about.html', {
        'team_members': team_members
    })

def blogs(request):
    """Render blogs page with pagination and caching."""
    page_number = request.GET.get('page', 1)
    cache_key = f"blogs_page_{page_number}"
    cached_page = cache.get(cache_key)
    
    if cached_page:
        return render(request, 'blogs.html', {'blogs': cached_page})
    
    paginator = Paginator(
        Blog.objects.only("id", "title", "slug", "created_at").order_by("-created_at"), 4)
    page_obj = paginator.get_page(page_number)
    
    cache.set(cache_key, page_obj, 60 * 30) 
    return render(request, 'blogs.html', {
        'blogs': page_obj
    })

def blog_detail(request, slug):
    blog = get_object_or_404(Blog, slug=slug)
    all_recent = Blog.objects.exclude(id=blog.id).order_by('-created_at')
    paginator = Paginator(all_recent, 4)
    page_number = request.GET.get('page')
    recent_blogs = paginator.get_page(page_number)
    return render(request, 'blog_detail.html', {
        'blog': blog,
        'recent_blogs': recent_blogs
    })

def treks(request):
    category_id = request.GET.get('category')
    difficulty = request.GET.get('difficulty')
    page_number = request.GET.get('page', 1)

    cache_key = f"treks_{page_number}_{category_id}_{difficulty}"
    cached = cache.get(cache_key)
    if cached:
        return render(request, 'treks.html', cached)

    qs = Trek.objects.all()
    if category_id:
        qs = qs.filter(category_id=category_id)
    if difficulty:
        qs = qs.filter(difficulty=difficulty)

    paginator = Paginator(qs, 12)
    page_obj = paginator.get_page(page_number)

    context = {
        'treks': page_obj,
        'categories': get_trek_categories(),
        'selected_category': category_id,
        'selected_difficulty': difficulty,
        'difficulty_choices': Trek.DIFFICULTY_CHOICES,
    }

    cache.set(cache_key, context, 60 * 30)
    return render(request, 'treks.html', context)

def trek_detail(request, slug):
    """Display detailed view of a trek with caching."""
    cache_key = f"trek_detail_{slug}"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return render(request, 'trek_detail.html', cached_data)
    
    trek = get_object_or_404(Trek, slug=slug)
    context = {
        'trek': trek,
        'testimonials': trek.testimonials.all(),
        'similar_treks': Trek.objects.filter(category=trek.category).exclude(id=trek.id)[:3],
    }
    
    cache.set(cache_key, context, 60 * 60)  # 1 hour
    return render(request, 'trek_detail.html', context)

def safety(request):
    """Render safety page with cached safety tips."""
    cache_key = "safety_page_tips"
    safety_tips = cache.get(cache_key)
    
    if not safety_tips:
        safety_tips = SafetyTip.objects.all().order_by('order')
        cache.set(cache_key, safety_tips, 60 * 60)  # 1 hour
    
    return render(request, 'safety.html', {
        'safety_tips': safety_tips
    })

def detect_trek_category(message: str):
    message = message.lower()

    if any(word in message for word in ["adventure", "hills", "mountain", "climb"]):
        return "adventure"

    if any(word in message for word in ["camp", "camping", "tent", "bonfire"]):
        return "camping"

    if any(word in message for word in ["nature", "green", "greenery", "forest", "waterfall"]):
        return "nature"

    if any(word in message for word in ["beach", "sea", "coast"]):
        return "beach"

    if any(word in message for word in ["spiritual", "temple", "holy", "pilgrimage"]):
        return "spiritual"

    if any(word in message for word in ["weekend", "short trip", "getaway"]):
        return "weekend"

    return None

def contact(request):

    if request.method == "GET":
        return render(request, "contact.html")
    
    name = request.POST.get("name")
    email = request.POST.get("email")
    mobile = request.POST.get("mobile")
    user_type = request.POST.get("user_type")   # trekker / organizer / other
    message = request.POST.get("comment")
    trek_category = request.POST.get("trek_category")  # Category selected in dropdown

    # Validate all required fields
    if not all([name, email, mobile, user_type, message]):
        return JsonResponse({"error": "Please fill all required fields"}, status=400)

    # Save to database
    Contact.objects.create(
        name=name, email=email, mobile=mobile,
        user_type=user_type, comment=message
    )

    TREK_LINKS = {
        "adventure": "https://www.aorbotreks.com/travel-your-way/?tag=adventure",
        "camping": "https://www.aorbotreks.com/travel-your-way/?tag=camping",
        "nature": "https://www.aorbotreks.com/travel-your-way/?tag=nature",
        "beach": "https://www.aorbotreks.com/travel-your-way/?tag=beach",
        "spiritual": "https://www.aorbotreks.com/travel-your-way/?tag=spiritual",
        "weekend": "https://www.aorbotreks.com/travel-your-way/?tag=weekend",
    }
    detected_category = None
    explore_link = "https://www.aorbotreks.com"
    subject = "We've Received Your Query – Aorbo Treks"
    template_name = "emails/contact_default.html"

    if user_type == "trekker":
        if trek_category:
            detected_category = trek_category
        else:
            detected_category = detect_trek_category(message)
        
        explore_link = TREK_LINKS.get(
            detected_category,
            "https://www.aorbotreks.com/treks"
        )
        subject = f"{detected_category.title() if detected_category else 'Explore'} Treks – Aorbo Treks"
        template_name = "emails/trekker.html"

    elif user_type == "organizer":
        explore_link = "https://partner.aorbotreks.com"
        subject = "Partnership Request – Aorbo Treks"
        template_name = "emails/organizer.html"

    else:
        explore_link = "https://www.aorbotreks.com"
        subject = "We've Received Your Query – Aorbo Treks"
        template_name = "emails/other.html"

    display_category = detected_category.title() if detected_category else "Our Featured"
    
    context = {
        "name": name,
        "email": email,
        "message": message,
        "detected_category": detected_category,
        "display_category": display_category,
        "explore_link": explore_link,
        "current_year": datetime.now().year,
    }

    html_content = render_to_string(template_name, context)

    try:
        mail = EmailMultiAlternatives(
            subject=subject,
            body="Thank you for contacting Aorbo Treks.",
            from_email="Aorbo Treks <" + settings.DEFAULT_FROM_EMAIL + ">",
            to=[email],
        )
        mail.attach_alternative(html_content, "text/html")
        # mail.send()
        send_email_async(mail)
    except Exception as e:
        return JsonResponse({"error": f"Failed to send email: {str(e)}"}, status=500)

    return JsonResponse({"message": "Message sent successfully"})

def travel_your_way(request):
    """Display treks filtered by selected tag."""
    selected_tag = request.GET.get("tag")
    if not selected_tag:
        return redirect("home")

    treks = TrekList.objects.filter(tags__name__iexact=selected_tag).distinct()
    return render(request, "travel_your_way.html", {
        "selected_tag": selected_tag,
        "treks": treks,
    })


def card_trek_detail(request, slug):
    """Display detailed view of a trek with related treks."""
    trek = get_object_or_404(TrekList, id=slug)
    related_treks = trek.related_treks.all() if hasattr(trek, "related_treks") else TrekList.objects.none()
    
    activities_list = [a.strip() for a in trek.activities.split(",")] if trek.activities else []

    return render(request, "card_details.html", {
        "trek": trek,
        "related_treks": related_treks,
        "activities_list": activities_list,
    })


def privacy_policy(request):
    return render(request, "privacypolicy.html")

def terms_and_conditions(request):
    return render(request, "terms_and_conditions.html")

def user_agreement(request):
    return render(request, "user_agreement.html")


@api_view(['GET'])
def api_featured_treks(request):
    selected_tag = request.GET.get('tag', '').strip()
    search_query = request.GET.get('q', '').strip()
    page_number = request.GET.get('page', 1)

    # ✅ Log search
    if str(page_number) == '1' and (selected_tag or search_query):
        SearchLog.objects.create(
            query=search_query,
            tag=selected_tag,
            ip_address=request.META.get('REMOTE_ADDR')
        )

    cache_key = f"api_home_page_{page_number}_{selected_tag}_{search_query}"
    cached_response = cache.get(cache_key)
    if cached_response:
        return Response(cached_response)

    # ✅ Build fresh queryset with images prefetched
    queryset = (
        TrekList.objects
        .prefetch_related('images', 'tags')
        .annotate(
            pin_order=Case(
                When(is_pinned=True, then=0),
                default=1,
                output_field=IntegerField()
            )
        )
        .order_by('pin_order', 'pin_priority', '-created_at')
    )

    if selected_tag:
        queryset = queryset.filter(tags__name__iexact=selected_tag).distinct()

    if search_query:
        cleaned = clean_query(search_query)
        if cleaned:
            queryset = queryset.filter(
                Q(name__icontains=cleaned) |
                Q(state__icontains=cleaned) |
                Q(tags__name__icontains=cleaned)
            ).distinct()

    paginator = Paginator(queryset, 8)
    page_obj = paginator.get_page(page_number)

    results = []
    for item in page_obj:
        # ✅ Clean simple image logic
        img_url = ""
        images = item.images.all()
        if images:
            first = images[0]
            if first.image_url:
                img_url = str(first.image_url).rstrip('?')
        if not img_url and item.image and 'example.com' not in str(item.image):
            img_url = str(item.image).rstrip('?')
        operators_list = list(item.operators.values_list('name', flat=True))
        if not operators_list:
            operators_list = ["Aorbo Certified Partner"]

        results.append({
            "id": item.id,
            "slug": str(item.id),
            "name": item.name,
            "state": item.state,
            "price_start": item.price_start if item.price_start else "N/A",
            "duration_days": item.duration_days if item.duration_days else "3D/2N",
            "operating_days": item.operating_days if item.operating_days else "THU, FRI, SAT",
            "images": [{"image_url": img_url}] if img_url else [],
            "operators": operators_list
        })

    response_data = {
        "results": results,
        "total_pages": paginator.num_pages
    }

    cache.set(cache_key, response_data, 60 * 10)
    return Response(response_data)

@api_view(['GET'])
def api_trek_detail(request, slug):
    try:
        trek_item = TrekList.objects.prefetch_related(
            'operators', 'trek_points', 'images', 'related_treks'
        ).get(id=slug)
    except TrekList.DoesNotExist:
        return Response({"error": "Trek not found"}, status=404)

    # ✅ operators is ManyToManyField to Operator model
    operators_list = list(trek_item.operators.values_list('name', flat=True))
    if not operators_list:
        operators_list = ["Aorbo Certified Partner"]

    # ✅ trek_points is ManyToManyField to TrekPoint model (famous places)
    places_list = list(trek_item.trek_points.values_list('name', flat=True))

    # activities from TextField
    activities_list = [a.strip() for a in trek_item.activities.split(",")] if trek_item.activities else []

    # related treks
    related_treks = []
    for rel in trek_item.related_treks.all():
        related_treks.append({
            "id": rel.id,
            "slug": rel.id,
            "name": rel.name,
            "state": rel.state
        })

    # image
    img_url = ""
    if trek_item.images.exists():
        first_image = trek_item.images.first()
        if first_image.image_url:
            img_url = str(first_image.image_url)

    return Response({
        "id": trek_item.id,
        "name": trek_item.name,
        "description": trek_item.short_desc or "",
        "state": trek_item.state,
        "price_start": trek_item.price_start,
        "duration_days": trek_item.duration_days or "3D/2N",
        "operating_days": trek_item.operating_days or "Thu, Fri, Sat",
        "main_image": img_url,
        "activities": activities_list,
        "famous_places": places_list,
        "operators": operators_list,
        "related_treks": related_treks
    })
@api_view(['GET'])
def api_search_suggestions(request):
    """
    Feeds instant drop-down query matches to the React hero search bar wrapper.
    """
    query = request.GET.get("q", "").strip().lower()
    if len(query) < 2:
        return Response([])

    # if len(query) >= 4:
    #     SearchLog.objects.create(query=query, ip_address=request.META.get('REMOTE_ADDR'))
    # Query matching against TrekList records 
    treks = TrekList.objects.filter(name__icontains=query).only("id", "name", "state")[:8]
    
    results = []
    for t in treks:
        results.append({
            "id": t.id,
            "name": t.name,
            "state": t.state
        })
    return Response(results)
@csrf_exempt
@api_view(['POST'])
def api_log_trek_click(request):
    trek_id = request.data.get('trek_id', '')
    query = request.data.get('query', '')
    tag = request.data.get('tag', '')

    trek = None
    if trek_id:
        try:
            trek = TrekList.objects.get(id=trek_id)
        except TrekList.DoesNotExist:
            pass

    SearchLog.objects.create(
        query=query,
        tag=tag,
        trek=trek,
        ip_address=request.META.get('REMOTE_ADDR')
    )
    return Response({"status": "logged"})
@api_view(['GET'])
def api_analytics(request):
    period = request.GET.get('period', '30days')
    qs = SearchLog.objects.all()
    now = dj_timezone.now()

    if period == 'today':
        qs = qs.filter(searched_at__date=now.date())
    elif period == '7days':
        qs = qs.filter(searched_at__gte=now - timedelta(days=7))
    elif period == '30days':
        qs = qs.filter(searched_at__gte=now - timedelta(days=30))
    elif period == 'year':
        qs = qs.filter(searched_at__year=now.year)

    return Response({'total_searches': qs.count()})

@api_view(['GET'])
def api_travel_your_way(request):
    tag = request.GET.get('tag', '').strip()
    page_number = request.GET.get('page', 1)
    if not tag:
        return Response({"results": [], "total_pages": 1})
 # ✅ Check cache first
    cache_key = f"api_travel_your_way_{tag}_{page_number}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)
    queryset = TrekList.objects.filter(
        tags__name__iexact=tag
    ).prefetch_related('images', 'tags').distinct()
    paginator = Paginator(queryset, 12)               # ← added, 12 per page
    page_obj = paginator.get_page(page_number)
    results = []
    for item in page_obj:
        img_url = ""
        if hasattr(item, 'images') and item.images.exists():
            first_image = item.images.first()
            if hasattr(first_image, 'image_url') and first_image.image_url:
                img_url = first_image.image_url.url if hasattr(first_image.image_url, 'url') else str(first_image.image_url)

        operators_list = []
        if hasattr(item, 'operators_list') and item.operators_list:
            operators_list = [op.strip() for op in item.operators_list.split(',')]
        else:
            operators_list = ["Aorbo Certified Partner"]

        results.append({
            "id": item.id,
            "name": item.name,
            "state": item.state,
            "price_start": item.price_start if hasattr(item, 'price_start') else "N/A",
            "duration_days": item.duration_days if hasattr(item, 'duration_days') else "3D/2N",
            "operating_days": item.operating_days if hasattr(item, 'operating_days') else "THU, FRI, SAT",
            "images": [{"image_url": img_url}] if img_url else [],
            "operators": operators_list
        })

    # 3. Save the serialized data to your cache for 10 minutes (matching your home template)
    cache.set(cache_key, {"results": results, "total_pages": paginator.num_pages}, 60 * 10)
    return Response({"results": results, "total_pages": paginator.num_pages})

@api_view(['GET'])
def api_blogs_list(request):
    page_number = request.GET.get('page', 1)
    exclude_slug = request.GET.get('exclude', '')

    qs = Blog.objects.all().order_by('-created_at')
    if exclude_slug:
        qs = qs.exclude(slug=exclude_slug)

    paginator = Paginator(qs, 4)
    page_obj = paginator.get_page(page_number)

    results = []
    for blog in page_obj:
        results.append({
            "title": blog.title,
            "slug": blog.slug,
            "excerpt": blog.excerpt,
            "content": blog.content,
            "image_url": blog.image_url,
            "author": blog.author,
            "created_at": blog.created_at.isoformat(),
        })

    return Response({
        "results": results,
        "total_pages": paginator.num_pages,
        "next": page_obj.has_next(),
        "previous": page_obj.has_previous(),
    })


@api_view(['GET'])
def api_blog_detail(request, slug):
    try:
        blog = Blog.objects.get(slug=slug)
    except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=404)

    page_number = request.GET.get('page', 1)

    all_recent = Blog.objects.exclude(id=blog.id).order_by('-created_at')
    paginator = Paginator(all_recent, 4)
    page_obj = paginator.get_page(page_number)

    recent_blogs = []
    for b in page_obj:
        recent_blogs.append({
            "title": b.title,
            "slug": b.slug,
            "image_url": b.image_url,
            "created_at": b.created_at.isoformat(),
        })

    return Response({
        "blog": {
            "title": blog.title,
            "slug": blog.slug,
            "excerpt": blog.excerpt,
            "content": blog.content,
            "image_url": blog.image_url,
            "author": blog.author,
            "created_at": blog.created_at.isoformat(),
        },
        "recent_blogs": recent_blogs,
        "has_previous": page_obj.has_previous(),
        "has_next": page_obj.has_next(),
    })