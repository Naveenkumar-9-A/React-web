"""
Geocoding utility using OpenStreetMap Nominatim API.
Converts location names to latitude/longitude coordinates.
FINAL SEARCH REFINEMENT: Enhanced with filtering and normalization
"""

import requests
from django.core.cache import cache
import logging
import re

logger = logging.getLogger(__name__)

# Common Indian locations mapping for faster lookups
LOCATION_CACHE = {
    "varanasi": {"lat": 25.3241, "lon": 82.9789},
    "hyderabad": {"lat": 17.3850, "lon": 78.4867},
    "bangalore": {"lat": 12.9716, "lon": 77.5946},
    "araku": {"lat": 17.6869, "lon": 82.3476},
    "coorg": {"lat": 12.3381, "lon": 75.7421},
    "chikmagalur": {"lat": 13.3150, "lon": 75.7637},
    "delhi": {"lat": 28.7041, "lon": 77.1025},
    "mumbai": {"lat": 19.0760, "lon": 72.8777},
    "kolkata": {"lat": 22.5726, "lon": 88.3639},
    "jaipur": {"lat": 26.9124, "lon": 75.7873},
    "agra": {"lat": 27.1767, "lon": 78.0081},
    "goa": {"lat": 15.4909, "lon": 73.8278},
    "kerala": {"lat": 10.8505, "lon": 76.2711},
    "darjeeling": {"lat": 27.0410, "lon": 88.2663},
    "shimla": {"lat": 31.7750, "lon": 77.1670},
    "manali": {"lat": 32.2396, "lon": 77.1887},
    "ladakh": {"lat": 34.1526, "lon": 77.5770},
    "rajasthan": {"lat": 27.5922, "lon": 75.5046},
    "srisailam": {"lat": 15.4667, "lon": 78.3333},
    "tada": {"lat": 14.4333, "lon": 78.5000},
    "talakona": {"lat": 13.1333, "lon": 79.4333},
    "nagalapuram": {"lat": 13.8833, "lon": 79.4667},
    "kailasagiri": {"lat": 13.1667, "lon": 80.2500},
    "char dham": {"lat": 30.2220, "lon": 79.1750},
    "kedarnath": {"lat": 30.7316, "lon": 79.1733},
    "badrinath": {"lat": 30.7464, "lon": 79.4925},
    "munnar": {"lat": 10.5895, "lon": 77.0571},
}

# ========================================
# BUG 1: TREKKING CATEGORY WHITELIST
# ========================================
VALID_TREKKING_CATEGORIES = {
    'tourism',
    'natural',
    'peak',
    'mountain',
    'hill',
    'waterfall',
    'forest',
    'wood',
    'nature_reserve',
    'national_park',
    'viewpoint',
    'camp_site',
    'beach',
    'cliff',
    'trail',
    'trek',
    'hiking',
    'wilderness',
    'protected_area',
    'pilgrimage',
    'pilgrimage_hill',
    'temple_hill',
    'adventure',
    'leisure',
}

# REJECT these categories completely
REJECTED_CATEGORIES = {
    'place', 'boundary', 'administrative', 'shop', 'office',
    'residential', 'building', 'amenity', 'highway', 'railway',
    'public_transport', 'education', 'health', 'commercial',
    'industrial', 'military', 'craft', 'personal_services',
}

# REJECT keywords in name
REJECTED_KEYWORDS = {
    'parlour', 'salon', 'clinic', 'hospital', 'school', 'college',
    'university', 'company', 'office', 'shop', 'store', 'mall',
    'restaurant', 'cafe', 'bar', 'pub', 'hotel', 'motel', 'apartment',
    'flat', 'house', 'villa', 'residential', 'bus stand', 'railway',
    'airport', 'station', 'terminal', 'road', 'street', 'village',
    'city', 'town', 'hamlet', 'lane', 'avenue', 'boulevard',
}

def normalize_search_query(query):
    """
    BUG 5: Normalize search query for better matching
    
    Examples:
    "Tada Falls" → "tada falls"
    "Char Dham Yatra" → "char dham"
    """
    if not query:
        return ""
    
    # Convert to lowercase
    normalized = query.lower().strip()
    
    # Remove extra spaces
    normalized = ' '.join(normalized.split())
    
    # Remove "falls", "trek", "yatra" suffix
    normalized = re.sub(r'\s+(falls|trek|yatra|trail|route)$', '', normalized)
    
    return normalized


def get_search_variations(query):
    """
    BUG 5: Generate query variations to try
    
    Examples:
    "Tada Falls" → ["Tada Falls", "Tada", "Tada Waterfalls"]
    "Char Dham" → ["Char Dham", "Char", "Kedarnath"]
    """
    variations = [query]
    normalized = normalize_search_query(query)
    
    # Add normalized version
    if normalized != query.lower():
        variations.append(normalized)
    
    # Add first word only
    first_word = normalized.split()[0] if normalized else ""
    if first_word and first_word != normalized:
        variations.append(first_word)
    
    # Add second word if exists (for multi-word queries)
    words = normalized.split()
    if len(words) > 1:
        variations.append(words[0] + " " + words[1])
    
    # Special cases - add known alternatives
    aliases = {
        'char dham': ['kedarnath', 'badrinath', 'yamunotri', 'gangotri'],
        'tada': ['ubbalamadugu'],
        'kailasa': ['kailasagiri'],
        'srisai': ['srisailam'],
    }
    
    for key, alts in aliases.items():
        if key in normalized:
            variations.extend(alts)
    
    # Remove duplicates and empty strings
    variations = [v.strip() for v in variations if v.strip()]
    variations = list(dict.fromkeys(variations))  # Remove duplicates preserving order
    
    return variations


def is_trekking_destination(osm_result):
    """
    BUG 1: Filter - Is this a trekking/tourism destination?
    """
    if not osm_result:
        return False
    
    name = osm_result.get('name', '').lower()
    category = osm_result.get('category', '').lower()
    osm_class = osm_result.get('class', '').lower()
    
    # Check for rejected keywords
    for keyword in REJECTED_KEYWORDS:
        if keyword in name:
            logger.warning(f"❌ Rejected (keyword '{keyword}'): {name}")
            return False
    
    # Check for rejected categories
    if category in REJECTED_CATEGORIES or osm_class in REJECTED_CATEGORIES:
        logger.warning(f"❌ Rejected (category '{category}'): {name}")
        return False
    
    # Check for valid categories
    if category in VALID_TREKKING_CATEGORIES or osm_class in VALID_TREKKING_CATEGORIES:
        logger.info(f"✅ Accepted (category '{category}'): {name}")
        return True
    
    logger.warning(f"❌ Rejected (no match): {name}")
    return False


def get_result_rank(osm_result):
    """
    BUG 4: Ranking algorithm - Higher score = higher priority
    """
    name = osm_result.get('name', '').lower()
    category = osm_result.get('category', '').lower()
    
    rank = 0
    
    # Exact match gets highest score
    if 'waterfall' in name:
        rank += 1000
    if 'peak' in name or 'summit' in name:
        rank += 900
    if 'mountain' in name:
        rank += 800
    if 'trek' in name or 'trail' in name:
        rank += 700
    if 'national park' in name or 'sanctuary' in name:
        rank += 600
    if 'forest' in name:
        rank += 500
    if 'beach' in name:
        rank += 400
    if 'valley' in name:
        rank += 350
    if 'camp' in name or 'camping' in name:
        rank += 300
    if 'adventure' in name:
        rank += 250
    if 'spiritual' in name or 'temple' in name or 'pilgrimage' in name:
        rank += 200
    
    # Category bonus
    if category == 'waterfall':
        rank += 900
    elif category == 'peak' or category == 'mountain':
        rank += 800
    elif category == 'natural':
        rank += 700
    elif category == 'national_park':
        rank += 600
    elif category == 'tourism':
        rank += 400
    elif category == 'adventure':
        rank += 350
    
    return rank


def geocode_location(location_name):
    """
    Convert location name to coordinates using OpenStreetMap Nominatim API.
    
    Args:
        location_name (str): Name of the location (e.g., "Varanasi")
    
    Returns:
        dict: {"lat": float, "lon": float} or None if not found
    """
    
    if not location_name:
        return None
    
    normalized_name = location_name.lower().strip()
    
    # Check built-in cache first
    if normalized_name in LOCATION_CACHE:
        return LOCATION_CACHE[normalized_name]
    
    # Check Django cache
    cache_key = f"geocode_{normalized_name}"
    cached_result = cache.get(cache_key)
    if cached_result:
        return cached_result
    
    try:
        # OpenStreetMap Nominatim API
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": f"{location_name}, India",
            "format": "json",
            "limit": 1,
        }
        
        headers = {
            "User-Agent": "AorboTreks/1.0 (Trek Mapping Service)"
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        
        results = response.json()
        
        if results and len(results) > 0:
            result = results[0]
            coords = {
                "lat": float(result["lat"]),
                "lon": float(result["lon"])
            }
            
            # Cache for 30 days
            cache.set(cache_key, coords, 60 * 60 * 24 * 30)
            return coords
        
        logger.warning(f"Geocoding failed: No results for {location_name}")
        return None
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Geocoding API error for {location_name}: {e}")
        return None
    except (KeyError, ValueError, IndexError) as e:
        logger.error(f"Geocoding parsing error for {location_name}: {e}")
        return None


def filter_osm_results(results):
    """
    BUG 1: Filter OpenStreetMap results - only keep trekking destinations
    """
    if not results:
        return []
    
    filtered = []
    seen_names = set()
    
    for result in results:
        name = result.get('name', '').lower().strip()
        
        # Skip duplicates
        if name in seen_names:
            continue
        
        # Check if trekking destination
        if is_trekking_destination(result):
            filtered.append(result)
            seen_names.add(name)
    
    # BUG 4: Sort by ranking
    filtered.sort(key=lambda x: get_result_rank(x), reverse=True)
    
    return filtered


def search_osm_multiple_queries(query):
    """
    BUG 2 & BUG 5: Try multiple queries before giving up
    """
    variations = get_search_variations(query)
    all_results = []
    seen_names = set()
    
    logger.info(f"🔍 Searching with {len(variations)} variations: {variations}")
    
    for variation in variations:
        try:
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": f"{variation}, India",
                "format": "json",
                "limit": 20,
                "countrycodes": "in"
            }
            
            headers = {
                "User-Agent": "AorboTreks/1.0 (Trek Mapping Service)"
            }
            
            response = requests.get(url, params=params, headers=headers, timeout=5)
            response.raise_for_status()
            
            results = response.json()
            logger.info(f"  ✓ Query '{variation}': {len(results)} results")
            
            # Add unique results
            for result in results:
                name = result.get('name', '').lower().strip()
                if name not in seen_names:
                    all_results.append(result)
                    seen_names.add(name)
            
        except Exception as e:
            logger.warning(f"  ✗ Query '{variation}' failed: {e}")
            continue
    
    logger.info(f"📍 Total unique results: {len(all_results)}")
    
    # Filter and rank
    filtered = filter_osm_results(all_results)
    logger.info(f"✅ After filtering: {len(filtered)} trekking destinations")
    
    return filtered


def geocode_multiple_locations(locations):
    """
    Geocode multiple locations efficiently.
    
    Args:
        locations (list): List of location names
    
    Returns:
        dict: {location_name: {"lat": float, "lon": float}}
    """
    results = {}
    for location in locations:
        coords = geocode_location(location)
        if coords:
            results[location] = coords
    return results


# ========================================
# TREKKING DESTINATION VALIDATION
# ========================================

# Accepted trekking-related categories from OpenStreetMap
TREKKING_CATEGORIES = {
    'tourism',
    'natural',
    'peak',
    'mountain',
    'waterfall',
    'forest',
    'wood',
    'park',
    'national_park',
    'nature_reserve',
    'viewpoint',
    'beach',
    'cliff',
    'valley',
    'trail',
    'camp_site',
    'wilderness_hut',
    'attraction',
    'pilgrimage',
    'temple_hill',
    'trekking_route',
    'adventure',
    'hiking',
    'leisure',
}

# Rejected OSM classes (too generic)
REJECTED_OSM_CLASSES = {
    'place',
    'boundary',
    'administrative',
    'shop',
    'office',
    'residential',
    'building',
    'amenity',
    'highway',
    'railway',
    'public_transport',
    'education',
    'health',
    'commercial',
    'industrial',
}

# Reject if name contains these keywords
REJECTED_KEYWORDS = {
    'apple', 'mango', 'banana', 'orange', 'grape', 'fruit',
    'college', 'university', 'school', 'institute', 'engineering',
    'hospital', 'clinic', 'medical', 'pharmacy',
    'street', 'road', 'lane', 'avenue', 'boulevard', 'highway',
    'house', 'home', 'apartment', 'flat', 'building',
    'shop', 'store', 'mall', 'market', 'bazaar',
    'restaurant', 'cafe', 'bar', 'pub', 'lounge',
    'hotel', 'resort', 'motel', 'lodge',
    'bus', 'station', 'airport', 'railway', 'terminal',
    'company', 'office', 'corporate', 'business',
    'temple', 'mosque', 'church', 'gurudwara',
}

# Smart keyword filtering for immediate rejection
TREKKING_KEYWORDS = {
    'trek', 'trekking', 'mountain', 'peak', 'hill', 'climbing',
    'camping', 'bonfire', 'nature', 'adventure', 'waterfall',
    'trail', 'hiking', 'forest', 'national park', 'wildlife',
    'sanctuary', 'beach trail', 'weekend getaway', 'spiritual',
    'valley', 'viewpoint', 'camp site', 'wilderness',
}


def is_trekking_destination(osm_result):
    """
    ✅ BACKEND FILTERING: Validate if OSM result is a trekking destination.
    
    Args:
        osm_result (dict): OpenStreetMap result with 'name', 'category', 'class', 'type'
    
    Returns:
        bool: True if trekking-related, False otherwise
    """
    
    if not osm_result:
        return False
    
    name = osm_result.get('name', '').lower().strip()
    category = osm_result.get('category', '').lower().strip()
    osm_class = osm_result.get('class', '').lower().strip()
    osm_type = osm_result.get('type', '').lower().strip()
    
    # Step 1: Check if name contains rejected keywords
    for keyword in REJECTED_KEYWORDS:
        if keyword in name:
            logger.warning(f"❌ Rejected (rejected keyword '{keyword}'): {name}")
            return False
    
    # Step 2: Check if category is in trekking categories (HIGHEST PRIORITY)
    if category in TREKKING_CATEGORIES:
        logger.info(f"✅ Accepted (category '{category}'): {name}")
        return True
    
    # Step 3: Check if type matches trekking
    if osm_type in TREKKING_CATEGORIES:
        logger.info(f"✅ Accepted (type '{osm_type}'): {name}")
        return True
    
    # Step 4: Check if name contains trekking keywords
    for keyword in TREKKING_KEYWORDS:
        if keyword in name:
            logger.info(f"✅ Accepted (trekking keyword '{keyword}'): {name}")
            return True
    
    # Step 5: If it's a "place", only reject if it has rejected keywords (already checked)
    # Places like Srisailam, Munnar, etc. are valid destinations even with class='place'
    # They should only be rejected if they have rejected keywords or are clearly non-trekking
    if osm_class == 'place':
        logger.info(f"✅ Accepted (place: {name})")
        return True
    
    # Step 6: Check if OSM class is in rejected list
    if osm_class in REJECTED_OSM_CLASSES:
        logger.warning(f"❌ Rejected (rejected class '{osm_class}'): {name}")
        return False
    
    logger.warning(f"❌ Rejected (no match): category='{category}', class='{osm_class}', name='{name}'")
    return False


def filter_osm_results(osm_results):
    """
    ✅ BACKEND FILTERING: Filter OSM results to only include trekking destinations.
    
    Args:
        osm_results (list): List of OpenStreetMap results
    
    Returns:
        list: Filtered list of trekking-related results
    """
    
    if not osm_results:
        return []
    
    filtered = []
    seen_names = set()  # Prevent duplicates
    
    for result in osm_results:
        # Skip if already seen (duplicate)
        result_name = result.get('name', '').lower().strip()
        if result_name in seen_names:
            logger.info(f"⚠️  Duplicate: {result_name}")
            continue
        
        # Check if trekking-related
        if is_trekking_destination(result):
            filtered.append(result)
            seen_names.add(result_name)
    
    return filtered
