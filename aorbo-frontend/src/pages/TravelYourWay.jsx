import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Clock, Calendar, ShieldCheck, ArrowUpRight } from 'lucide-react';
import '../styles/Home.css';

const TAG_META = {
  adventure: { icon: '⛰️', label: 'Adventure Treks',   subtitle: 'For thrill-seekers and explorers who crave a challenge.' },
  weekend:   { icon: '🌄', label: 'Weekend Getaways',   subtitle: 'Perfect short escapes to unwind and recharge.' },
  nature:    { icon: '🌲', label: 'Nature Escapes',     subtitle: 'Reconnect with nature through calm and scenic trails.' },
  beach:     { icon: '🌊', label: 'Beach Trails',       subtitle: 'Walk along the coast, enjoy sunsets, and feel the sea breeze.' },
  spiritual: { icon: '💗', label: 'Spiritual Journeys', subtitle: 'Find peace and purpose through sacred trails.' },
  camping:   { icon: '🏕️', label: 'Camping & Bonfire',  subtitle: 'Experience starlit nights and warm bonfires in the wild.' },
};

// ── Module-level cache: survives re-renders & tag switches within a session ──
const trekCache = {};

// ── Tracks tags currently being fetched so we never fire two requests for the same tag ──
const inFlight = new Set();

// 8 skeleton placeholder slots while fetching
const SKELETON_COUNT = 8;

export default function TravelYourWay() {
  const [searchParams] = useSearchParams();
  const [treks, setTreks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef(null);

  const selectedTag  = (searchParams.get('tag') || 'adventure').toLowerCase();
  const BACKEND_URL  = 'http://127.0.0.1:8000';

  const meta = TAG_META[selectedTag] || {
    icon: '🗺️',
    label: selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1),
    subtitle: 'Showing treks and trips that match your travel style.',
  };

  useEffect(() => {
    // Hit cache → instant render, no network
    if (trekCache[selectedTag]) {
      setTreks(trekCache[selectedTag]);
      setLoading(false);
      return;
    }

    // Already fetching this tag (React 18 Strict Mode double-invoke guard)
    if (inFlight.has(selectedTag)) return;

    // Cancel previous tag's in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    inFlight.add(selectedTag);
    setLoading(true);

    fetch(`${BACKEND_URL}/api/travel-your-way/?tag=${selectedTag}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const results = data.results || [];
        trekCache[selectedTag] = results;
        inFlight.delete(selectedTag);
        setTreks(results);
        setLoading(false);
      })
      .catch((err) => {
        inFlight.delete(selectedTag);
        if (err.name !== 'AbortError') {
          console.error('Failed to resolve custom category items:', err);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
      inFlight.delete(selectedTag);
    };
  }, [selectedTag]);

  // Prefetch all other tags silently after current tag loads
  // No `loading` in deps — runs once per selectedTag change after render
  useEffect(() => {
    const tags = Object.keys(TAG_META).filter(
      (t) => t !== selectedTag && !trekCache[t] && !inFlight.has(t)
    );
    if (tags.length === 0) return;

    // Stagger prefetches so they don't all hit Django at once
    const timers = tags.map((tag, i) =>
      setTimeout(() => {
        if (trekCache[tag] || inFlight.has(tag)) return;
        inFlight.add(tag);
        fetch(`${BACKEND_URL}/api/travel-your-way/?tag=${tag}`)
          .then((r) => r.json())
          .then((data) => {
            trekCache[tag] = data.results || [];
            inFlight.delete(tag);
          })
          .catch(() => inFlight.delete(tag));
      }, (i + 1) * 600)   // 600ms gap between each prefetch
    );

    return () => timers.forEach(clearTimeout);
  }, [selectedTag]);

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* ================= PAGE HEADER ================= */}
      <section className="tyw-page-header">
        <div className="container">
          <Link to="/" className="tyw-back-link">← Back to Home</Link>

          <div className="tyw-page-title-row">
            <span className="tyw-page-icon">{meta.icon}</span>
            <div>
              <p className="tyw-page-eyebrow">Travel Your Way</p>
              <h1 className="tyw-page-heading">{meta.label}</h1>
            </div>
          </div>

          <p className="tyw-page-subtitle">{meta.subtitle}</p>

          {/* Category pill switcher */}
          <div className="tyw-tag-switcher">
            {Object.entries(TAG_META).map(([tag, info]) => (
              <Link
                key={tag}
                to={`/travel-your-way?tag=${tag}`}
                className={`tyw-tag-pill ${selectedTag === tag ? 'tyw-tag-pill--active' : ''}`}
              >
                {info.icon} {info.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TREK GRID ================= */}
      <section style={{ backgroundColor: '#121824', padding: '3.5rem 0 4.5rem' }}>
        <div className="container">

          {loading ? (
            /* ── SKELETON GRID ── */
            <div className="row g-4">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="bolt-skeleton-card">
                    <div className="bolt-skeleton-img" />
                    <div className="bolt-skeleton-body">
                      <div className="bolt-skeleton-line bolt-skeleton-line--title" />
                      <div className="bolt-skeleton-line bolt-skeleton-line--short" />
                      <div className="bolt-skeleton-divider" />
                      <div className="bolt-skeleton-line bolt-skeleton-line--med" />
                      <div className="bolt-skeleton-line bolt-skeleton-line--med" />
                      <div className="bolt-skeleton-footer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : treks.length > 0 ? (
            /* ── REAL CARDS ── */
            <div className="row g-4">
              {treks.map((trek) => {
                const resolvedImageUrl =
                  trek.images && trek.images[0] && trek.images[0].image_url
                    ? trek.images[0].image_url.startsWith('http')
                      ? trek.images[0].image_url
                      : `${BACKEND_URL}${trek.images[0].image_url}`
                    : '/images/placeholder-trek.jpg';

                return (
                  <div key={trek.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to={`/treks/${trek.id}`} className="text-decoration-none d-block h-100">
                      <div className="bolt-premium-card">
                        <div className="bolt-shine" />
                        <div className="bolt-top-glow" />

                        <div className="bolt-image-wrapper">
                          <img src={resolvedImageUrl} alt={trek.name} loading="lazy" className="bolt-card-img" />
                          <div className="bolt-image-overlay" />
                          <div className="bolt-image-shimmer" />
                          <div className="bolt-price-badge">
                            <p className="bolt-price-onwards">Onwards*</p>
                            <p className="bolt-price-value">₹{trek.price_start?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        <div className="bolt-card-body">
                          <div>
                            <h3 className="bolt-card-title">
                              {trek.name.charAt(0).toUpperCase() + trek.name.slice(1).toLowerCase()}
                            </h3>
                            <div className="bolt-location-row">
                              <MapPin className="bolt-pin-icon" />
                              <span className="bolt-location-text">{trek.state}</span>
                            </div>
                          </div>

                          <div className="bolt-card-divider" />

                          <div className="bolt-specs-container">
                            <div className="bolt-spec-item">
                              <Clock className="bolt-spec-icon" />
                              <span className="bolt-spec-text">
                                <span className="bolt-spec-label">Duration: </span>
                                <span className="bolt-spec-val">{trek.duration_days} Days</span>
                              </span>
                            </div>
                            <div className="bolt-spec-item">
                              <Calendar className="bolt-spec-icon" />
                              <span className="bolt-spec-text">
                                <span className="bolt-spec-label">Departure: </span>
                                <span className="bolt-spec-val">{trek.operating_days?.toUpperCase()}</span>
                              </span>
                            </div>
                          </div>

                          <div className="bolt-card-footer">
                            <div className="bolt-partner-badge">
                              <ShieldCheck className="bolt-shield-icon" />
                              <span className="bolt-partner-text">Aorbo Certified Partner</span>
                            </div>
                            <div className="bolt-arrow-circle">
                              <ArrowUpRight className="bolt-arrow-icon" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

          ) : (
            <div
              className="text-center py-5"
              style={{ backgroundColor: '#1a2333', borderRadius: '16px', padding: '3rem', border: '1px solid rgba(251,191,36,0.1)' }}
            >
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#9ca3af', margin: 0 }}>
                No active trails matching this category at the moment.
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}