import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function CardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [relatedTreks, setRelatedTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    async function getDetails() {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/treks/${id}/`);
        if (!res.ok) throw new Error("Trek not found");
        const data = await res.json();
        setTrek(data);
        setRelatedTreks(data.related_treks || []);
      } catch (err) {
        console.error("Failed fetching trek details:", err);
      } finally {
        setLoading(false);
      }
    }
    getDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center', color: '#4b5563', fontSize: '1rem' }}>
        Loading trek details...
      </div>
    );
  }

  if (!trek) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center', color: '#4b5563' }}>
        Trek not found. Please go back and try again.
      </div>
    );
  }

  const imgSrc = trek.main_image
    ? (trek.main_image.startsWith('http') ? trek.main_image : `${BACKEND_URL}${trek.main_image}`)
    : '/images/placeholder.jpg';

  // Theme colors
  const yellow = '#FFE100';
  const yellowLight = '#FFF8C0';
  const yellowBorder = '#F5D800';
  const darkGreen = '#1a2e1a';
  const orange = '#ff6a1a';
  const pageBg = '#FFFDF0';  // warm gold-white background

  return (
    <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem', background: pageBg, minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '1.5rem', minHeight: '320px', background: darkGreen }}>
        <img
          src={imgSrc}
          alt={trek.name}
          style={{ width: '100%', height: '380px', objectFit: 'cover', opacity: 0.6, display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,20,10,0.92) 0%, rgba(10,20,10,0.3) 60%, transparent 100%)' }} />

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '999px', padding: '7px 18px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Back
        </button>

        {/* HERO CONTENT */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {trek.state && (
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '11px', padding: '3px 12px', borderRadius: '999px', backdropFilter: 'blur(4px)' }}>
                📍 {trek.state}
              </span>
            )}
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '700', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
            {trek.name}
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>🕒 {trek.duration_days}</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>📅 {trek.operating_days}</span>
            <span style={{ background: yellow, color: '#1a1a1a', fontSize: '13px', fontWeight: '700', padding: '5px 14px', borderRadius: '999px', marginLeft: 'auto' }}>
              ₹{trek.price_start} onwards
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '1.25rem', alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* DESCRIPTION */}
          <div style={{ background: yellowLight, border: `1px solid ${yellowBorder}`, borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.75rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: orange }}>📖</span> About this Trek
            </h2>
            <p style={{ color: '#374151', lineHeight: '1.8', fontSize: '0.98rem', margin: 0 }}>
              {trek.description || 'No description available.'}
            </p>
          </div>

          {/* ACTIVITIES */}
          {trek.activities?.length > 0 && (
            <div style={{ background: yellowLight, border: `1px solid ${yellowBorder}`, borderRadius: '16px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 1rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: orange }}>⚡</span> Activities
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {trek.activities.map((act, i) => (
                  <span key={i} style={{ background: yellow, color: '#1a1a1a', fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '999px', border: `1px solid ${yellowBorder}` }}>
                    {act}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FAMOUS PLACES */}
          <div style={{ background: yellowLight, border: `1px solid ${yellowBorder}`, borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 1rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: orange }}>📍</span> Famous Places
            </h2>
            {trek.famous_places?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                {trek.famous_places.map((place, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', background: '#fff', padding: '8px 12px', borderRadius: '10px', border: `1px solid ${yellowBorder}` }}>
                    <span style={{ color: orange, fontSize: '10px' }}>●</span> {place}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Coming soon...</p>
            )}
          </div>

          {/* RELATED TREKS */}
          {relatedTreks.length > 0 && (
            <div style={{ background: yellowLight, border: `1px solid ${yellowBorder}`, borderRadius: '16px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 1rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: orange }}>🗺️</span> Related Treks
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {relatedTreks.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/treks/${rel.id}`}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: `1px solid ${yellowBorder}`, borderRadius: '12px', color: '#111827', fontSize: '13px', fontWeight: '500', background: '#fff', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = orange; e.currentTarget.style.background = yellowLight; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = yellowBorder; e.currentTarget.style.background = '#fff'; }}
                  >
                    <span>{rel.name}</span>
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>{rel.state} →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* PRICE CARD */}
          <div style={{ background: darkGreen, borderRadius: '16px', padding: '1.5rem', color: '#fff' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.25rem' }}>Starting from</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: yellow, margin: '0 0 0.25rem', lineHeight: 1 }}>₹{trek.price_start}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem' }}>per person onwards*</p>
            <button
              style={{ width: '100%', background: yellow, color: '#1a1a1a', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5d800'}
              onMouseLeave={e => e.currentTarget.style.background = yellow}
            >
              Book Now
            </button>
          </div>

          {/* TRIP INFO */}
          <div style={{ background: yellowLight, border: `1px solid ${yellowBorder}`, borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 1rem', color: '#111827' }}>Trip Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>🕒 Duration</span>
                <span style={{ fontWeight: '600', color: '#111827' }}>{trek.duration_days}</span>
              </div>
              <div style={{ borderTop: `1px solid ${yellowBorder}` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>📅 Departure</span>
                <span style={{ fontWeight: '600', color: '#111827' }}>{trek.operating_days}</span>
              </div>
              <div style={{ borderTop: `1px solid ${yellowBorder}` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>📍 State</span>
                <span style={{ fontWeight: '600', color: '#111827' }}>{trek.state}</span>
              </div>
            </div>
          </div>

          {/* OPERATORS */}
          <div style={{ background: yellowLight, border: `1px solid ${yellowBorder}`, borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 1rem', color: '#111827' }}>
              ✅ Trusted Operators
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trek.operators?.length > 0 ? trek.operators.map((op, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '8px 10px', background: yellow, borderRadius: '10px', border: `1px solid ${yellowBorder}` }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: darkGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: yellow, fontWeight: '700', flexShrink: 0 }}>
                    {op.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ color: '#1a1a1a', fontWeight: '600' }}>{op}</span>
                </div>
              )) : (
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Coming soon...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}