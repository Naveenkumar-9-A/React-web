import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ExternalLink, Mountain, Leaf, Calendar, AlertCircle } from 'lucide-react';

export default function DestinationCard({ destination, searchQuery = '' }) {
  if (!destination) return null;

  const navigate = useNavigate();
  const BACKEND_URL = 'http://127.0.0.1:8000';

  const {
    name,
    display_name,
    lat,
    lon,
    category,
    description,
    activities,
    difficulty,
    best_season,
    nearby_attractions,
    travel_tips,
    altitude,
    distance_from_major_city,
    type = 'osm'
  } = destination;

  const osmMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`;

  // Handle click to navigate to TrekDetails with OSM destination data
  const handleViewDetails = () => {
    fetch(`${BACKEND_URL}/api/treks/log-click/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trek_id: '',
        query: searchQuery || destination.name,
        tag: '',
      }),
    }).catch(() => {});

    navigate('/treks/osm-destination', { 
      state: { destination } 
    });
  };

  return (
    <div className="destination-card" style={{
      background: 'linear-gradient(135deg, #1a2333 0%, #0f1419 100%)',
      border: '1px solid rgba(251, 191, 36, 0.15)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      color: '#e5e7eb'
    }}>
      {/* Header with Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{
            display: 'inline-block',
            background: 'rgba(251, 191, 36, 0.1)',
            color: '#fbbf24',
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            marginBottom: '0.5rem'
          }}>
            📍 {type === 'osm' ? 'OpenStreetMap' : 'Trek Destination'}
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: '0.5rem 0 0 0',
            color: '#ffffff'
          }}>
            {name}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleViewDetails}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
          >
            View Details
          </button>
          <a
            href={osmMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              background: 'rgba(251, 191, 36, 0.1)',
              color: '#fbbf24',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(251, 191, 36, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
            }}
          >
            <ExternalLink size={16} />
            View on Map
          </a>
        </div>
      </div>

      {/* Location Info */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(251, 191, 36, 0.1)'
      }}>
        <MapPin size={18} style={{ color: '#fbbf24', marginTop: '0.25rem', flexShrink: 0 }} />
        <div>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#9ca3af' }}>
            {display_name}
          </p>
          <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>
            📍 {lat.toFixed(4)}° N, {lon.toFixed(4)}° E
          </p>
        </div>
      </div>

      {/* Category */}
      {category && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Category
          </p>
          <p style={{ margin: '0', fontSize: '1rem', color: '#f3f4f6', textTransform: 'capitalize' }}>
            {category}
          </p>
        </div>
      )}

      {/* Description */}
      {description && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📖 Description
          </p>
          <p style={{ margin: '0', fontSize: '0.95rem', color: '#e5e7eb', lineHeight: '1.6' }}>
            {description}
          </p>
        </div>
      )}

      {/* Activities */}
      {activities && activities.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🎯 Activities
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {/* DEFENSIVE: Validate activities is array before mapping */}
            {Array.isArray(activities) ? (
              activities.map((activity, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#60a5fa',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {activity}
                </span>
              ))
            ) : (
              <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                ⚠️ Activities data error (not an array)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Difficulty & Season */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {difficulty && (
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Mountain size={16} style={{ display: 'inline', marginRight: '0.25rem' }} /> Difficulty
            </p>
            <p style={{ margin: '0', fontSize: '0.95rem', color: '#f3f4f6', textTransform: 'capitalize' }}>
              {difficulty}
            </p>
          </div>
        )}

        {best_season && (
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Calendar size={16} style={{ display: 'inline', marginRight: '0.25rem' }} /> Best Season
            </p>
            <p style={{ margin: '0', fontSize: '0.95rem', color: '#f3f4f6' }}>
              {best_season}
            </p>
          </div>
        )}
      </div>

      {/* Nearby Attractions */}
      {nearby_attractions && nearby_attractions.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Leaf size={16} style={{ display: 'inline', marginRight: '0.25rem' }} /> Nearby Attractions
          </p>
          <ul style={{ margin: '0', paddingLeft: '1.5rem', color: '#e5e7eb' }}>
            {/* DEFENSIVE: Validate nearby_attractions is array before mapping */}
            {Array.isArray(nearby_attractions) ? (
              nearby_attractions.map((attraction, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {attraction}
                </li>
              ))
            ) : (
              <li style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#ef4444' }}>
                ⚠️ Attractions data error (not an array)
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Travel Tips */}
      {travel_tips && travel_tips.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💡 Travel Tips
          </p>
          <ul style={{ margin: '0', paddingLeft: '1.5rem', color: '#e5e7eb' }}>
            {/* DEFENSIVE: Validate travel_tips is array before mapping */}
            {Array.isArray(travel_tips) ? (
              travel_tips.map((tip, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {tip}
                </li>
              ))
            ) : (
              <li style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#ef4444' }}>
                ⚠️ Tips data error (not an array)
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Distance and Altitude Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(251, 191, 36, 0.1)' }}>
        {altitude && (
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📏 Altitude
            </p>
            <p style={{ margin: '0', fontSize: '0.95rem', color: '#f3f4f6' }}>
              {altitude}
            </p>
          </div>
        )}

        {distance_from_major_city && (
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🚗 Distance
            </p>
            <p style={{ margin: '0', fontSize: '0.95rem', color: '#f3f4f6' }}>
              {distance_from_major_city}
            </p>
          </div>
        )}
      </div>

      {/* No Details Message */}
      {!description && !activities?.length && !difficulty && !best_season && !nearby_attractions?.length && !travel_tips?.length && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          background: 'rgba(251, 191, 36, 0.05)',
          borderRadius: '8px',
          color: '#9ca3af'
        }}>
          <AlertCircle size={18} />
          <p style={{ margin: '0', fontSize: '0.875rem' }}>
            Detailed information not available for this location. View on OpenStreetMap for more details.
          </p>
        </div>
      )}
    </div>
  );
}
