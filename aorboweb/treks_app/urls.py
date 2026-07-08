# treks_app/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Main pages
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),
    path('terms-and-conditions/', views.terms_and_conditions, name='terms_and_conditions'),
    path('user-agreement/', views.user_agreement, name='user_agreement'),
    path('safety/', views.safety, name='safety'),

    # Blog pages
    path('blogs/', views.blogs, name='blogs'),
    path('blogs/<slug:slug>/', views.blog_detail, name='blog_detail'),

    # Trek pages
    path('treks/', views.treks, name='treks'),
    path('treks/<slug:slug>/', views.trek_detail, name='trek_detail'),

    # Card-based trek detail
    path('card-trek/<slug:slug>/', views.card_trek_detail, name='card_trek_detail'),

    # 🚀 ADD THE TWO ENDPOINTS FOR YOUR REACT HOME PAGE HERE:
    path('api/treks/', views.api_featured_treks, name='api_featured_treks'),
    path('api/treks/search/', views.api_search_suggestions, name='api_search_suggestions'),
    path('api/treks/log-click/', views.api_log_trek_click, name='api_log_trek_click'),
path('api/analytics/', views.api_analytics, name='api_analytics'),
path('api/treks/<str:slug>/', views.api_trek_detail, name='api_trek_detail'),
path('api/travel-your-way/', views.api_travel_your_way, name='api_travel_your_way'),
path('api/blogs/', views.api_blogs_list, name='api_blogs_list'),
path('api/blogs/<slug:slug>/', views.api_blog_detail, name='api_blog_detail'),
    # AI Enrichment Endpoint
    path('api/enrich-destination/', views.api_enrich_destination, name='api_enrich_destination'),
    # ✅ PHASE 4: Nearby Destinations Discovery
    path('api/nearby-destinations/', views.api_nearby_destinations, name='api_nearby_destinations'),
    # ✅ SEARCH REFINEMENT: Backend OSM Filtering
    path('api/search/osm-filter/', views.filter_osm_results, name='filter_osm_results'),
    # ✅ FINAL FIX: Intelligent search with multi-query attempts
    path('api/search/intelligent/', views.api_search_intelligent, name='api_search_intelligent'),
    # Search
    path('search/', views.search_trek, name='search_trek'),
    path('search-suggestions/', views.search_suggestions, name='search_suggestions'),

    # Travel Your Way
    path('travel-your-way/', views.travel_your_way, name='travel_your_way'),

    # ✅ Contact (ONLY ONE)
    path('contact/', views.contact, name='contact'),
]