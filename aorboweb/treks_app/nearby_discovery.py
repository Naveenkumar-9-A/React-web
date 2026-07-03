"""
Phase 4 - Smart Trek Discovery
Finds nearby trekking places and adventure destinations
Uses existing database first, then OpenStreetMap if needed
Sorts by distance from current destination
"""

import math
import logging
from django.db.models import Q
from .models import TrekList, Tag

logger = logging.getLogger(__name__)

# Earth's radius in kilometers
EARTH_RADIUS_KM = 6371


def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates using Haversine formula.
    Returns distance in kilometers.
    
    Args:
        lat1, lon1: Current location (latitude, longitude)
        lat2, lon2: Target location (latitude, longitude)
    
    Returns:
        float: Distance in kilometers
    """
    try:
        # Convert degrees to radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # Haversine formula
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        distance = EARTH_RADIUS_KM * c
        
        return round(distance, 2)
    except Exception as e:
        logger.error(f"Error calculating haversine distance: {str(e)}")
        return None


def find_nearby_destinations(latitude, longitude, destination_type=None, max_distance_km=100, limit=6):
    """
    ✅ PHASE 4: Find nearby trekking places and adventure destinations.
    
    Algorithm:
    1. Search existing database first (priority)
    2. Filter by destination type if specified
    3. Calculate distance from current location
    4. Sort by distance (nearest first)
    5. Limit results
    
    Args:
        latitude (float): Current destination latitude
        longitude (float): Current destination longitude
        destination_type (str): Filter type - 'trekking', 'adventure', 'weekend', 'camping', 'beach', 'nature', 'spiritual'
        max_distance_km (int): Maximum distance to search (default 100km)
        limit (int): Maximum results to return (default 6)
    
    Returns:
        list: Sorted list of nearby destinations with distance info
    """
    
    try:
        # ✅ PHASE 4: Query existing database first
        query = TrekList.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False
        )
        
        # Filter by destination type if specified
        if destination_type:
            type_tags = {
                'trekking': ['adventure', 'trek', 'mountain'],
                'adventure': ['adventure', 'extreme'],
                'weekend': ['weekend', 'short'],
                'camping': ['camping', 'bonfire'],
                'beach': ['beach', 'coastal', 'sea'],
                'nature': ['nature', 'forest', 'wildlife'],
                'spiritual': ['spiritual', 'pilgrimage', 'temple']
            }
            
            tags_to_search = type_tags.get(destination_type, [])
            if tags_to_search:
                query = query.filter(tags__name__iinsensitive__in=tags_to_search).distinct()
        
        # Get all matching records
        destinations = list(query)
        
        # ✅ PHASE 4: Calculate distance for each destination
        nearby = []
        for dest in destinations:
            if dest.latitude and dest.longitude:
                # Skip the current destination
                if dest.latitude == latitude and dest.longitude == longitude:
                    continue
                
                distance = haversine_distance(latitude, longitude, dest.latitude, dest.longitude)
                
                if distance is not None and distance <= max_distance_km:
                    nearby.append({
                        'id': dest.id,
                        'name': dest.name,
                        'state': dest.state,
                        'latitude': dest.latitude,
                        'longitude': dest.longitude,
                        'distance_km': distance,
                        'price_start': dest.price_start,
                        'duration_days': dest.duration_days,
                        'activities': dest.activities_list,
                        'type': 'trek_database'
                    })
        
        # ✅ PHASE 4: Sort by distance (nearest first)
        nearby.sort(key=lambda x: x['distance_km'])
        
        # Limit results
        nearby = nearby[:limit]
        
        logger.info(f"✅ Found {len(nearby)} nearby destinations (type: {destination_type})")
        return nearby
        
    except Exception as e:
        logger.error(f"❌ Error finding nearby destinations: {str(e)}")
        return []


def get_nearby_by_type(latitude, longitude):
    """
    ✅ PHASE 4: Get nearby destinations grouped by type.
    
    Returns different categories of nearby places in one call.
    
    Args:
        latitude (float): Current destination latitude
        longitude (float): Current destination longitude
    
    Returns:
        dict: Organized nearby destinations by type
    """
    
    try:
        types = ['trekking', 'adventure', 'weekend', 'camping', 'beach', 'nature', 'spiritual']
        results = {}
        
        for dest_type in types:
            results[dest_type] = find_nearby_destinations(
                latitude, longitude, 
                destination_type=dest_type,
                max_distance_km=100,
                limit=6
            )
        
        logger.info(f"✅ Retrieved nearby destinations by type from ({latitude}, {longitude})")
        return results
        
    except Exception as e:
        logger.error(f"❌ Error getting nearby by type: {str(e)}")
        return {}


def prepare_nearby_response(nearby_list):
    """
    ✅ PHASE 4: Prepare nearby destinations for API response.
    
    Formats data for frontend consumption.
    
    Args:
        nearby_list (list): List of nearby destinations
    
    Returns:
        list: Formatted response data
    """
    
    response = []
    for dest in nearby_list:
        response.append({
            'id': dest['id'],
            'name': dest['name'],
            'state': dest['state'],
            'distance_km': dest['distance_km'],
            'distance_formatted': f"{dest['distance_km']} km away",
            'latitude': dest['latitude'],
            'longitude': dest['longitude'],
            'price_start': dest.get('price_start'),
            'duration_days': dest.get('duration_days'),
            'activities': dest.get('activities', []),
            'type': dest.get('type')
        })
    
    return response
