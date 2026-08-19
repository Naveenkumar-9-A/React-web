import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Clock, Calendar, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Home.css';

const TAG_META = {
  adventure: { icon: '⛰️', label: 'Adventure Treks',   subtitle: 'For thrill-seekers and explorers who crave a challenge.' },
  weekend:   { icon: '🌄', label: 'Weekend Getaways',   subtitle: 'Perfect short escapes to unwind and recharge.' },
  nature:    { icon: '🌲', label: 'Nature Escapes',     subtitle: 'Reconnect with nature through calm and scenic trails.' },
  beach:     { icon: '🌊', label: 'Beach Trails',       subtitle: 'Walk along the coast, enjoy sunsets, and feel the sea breeze.' },
  spiritual: { icon: '💗', label: 'Spiritual Journeys', subtitle: 'Find peace and purpose through sacred trails.' },
  camping:   { icon: '🏕️', label: 'Camping & Bonfire',  subtitle: 'Experience starlit nights and warm bonfires in the wild.' },
};

// Cache keyed by "tag__page" e.g. "adventure__1"
const trekCache = {};
const inFlight = new Set();
const SKELETON_COUNT = 8;
const ITEMS_PER_PAGE = 8;

export default function TravelYourWay() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const abortRef = useRef(null);

  const selectedTag  = (searchParams.get('tag')  || 'adventure').toLowerCase();
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const cacheKey = `${selectedTag}__${currentPage}`;

  const meta = TAG_META[selectedTag] || {
    icon: '🗺️',
    label: selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1),
    subtitle: 'Showing treks and trips that match your travel style.',
  };


  // Reset to page 1 when tag changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag]);


  // ── Main fetch ──

  useEffect(() => {
    if (trekCache[cacheKey]) {
      setTreks(trekCache[cacheKey].results);
      setTotalPages(trekCache[cacheKey].totalPages);
      setLoading(false);
      return;
    }

    if (inFlight.has(cacheKey)) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    inFlight.add(cacheKey);
    setLoading(true);

    fetch(`${BACKEND_URL}/api/travel-your-way/?tag=${selectedTag}&page=${currentPage}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const results    = data.results    || [];
        const totalPages = data.total_pages || 1;
        trekCache[cacheKey] = { results, totalPages };
        inFlight.delete(cacheKey);
        setTreks(results);
        setTotalPages(totalPages);
        setLoading(false);
        // Scroll to top of grid on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        inFlight.delete(cacheKey);
        if (err.name !== 'AbortError') {
          console.error('Failed to resolve custom category items:', err);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
      inFlight.delete(cacheKey);
    };
  }, [cacheKey]);

  // ── Prefetch next page in background ──
  useEffect(() => {
    if (loading || currentPage >= totalPages) return;
    const nextKey = `${selectedTag}__${currentPage + 1}`;
    if (trekCache[nextKey] || inFlight.has(nextKey)) return;

    const timer = setTimeout(() => {
      if (trekCache[nextKey] || inFlight.has(nextKey)) return;
      inFlight.add(nextKey);
      fetch(`${BACKEND_URL}/api/travel-your-way/?tag=${selectedTag}&page=${currentPage + 1}`)
        .then((r) => r.json())
        .then((data) => {
          trekCache[nextKey] = { results: data.results || [], totalPages: data.total_pages || 1 };
          inFlight.delete(nextKey);
        })
        .catch(() => inFlight.delete(nextKey));
    }, 800);

    return () => clearTimeout(timer);
  }, [loading, selectedTag, currentPage, totalPages]);

  // ── Pagination helpers ──
  const getPageUrl = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    return `?${params.toString()}`;
  };

  const getPaginationPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };
  const handleTrekClick = (trek) => {
    fetch(`${BACKEND_URL}/api/treks/log-click/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            trek_id: trek.id, 
            query: '',
            tag: selectedTag
        })
    });
  };

  // Pagination logic


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
                to={`/travel-your-way?tag=${tag}&page=1`}
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
            <>
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
                        <Link
                            to={`/treks/${trek.id}`}
                            onClick={() => handleTrekClick(trek)}
                            className="text-decoration-none d-block h-100"
                        >
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


              {/* Pagination Controls */}
{totalPages > 1 && (
  <div className="bolt-pagination-wrapper" style={{ marginTop: '3rem' }}>
    <button
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className={`bolt-pag-btn ${currentPage === 1 ? 'bolt-pag-disabled' : ''}`}
    >
      <ChevronLeft style={{ width: '16px', height: '16px' }} />
    </button>

                  {getPaginationPages().map((page, index) =>
  page === '...' ? (
    <span key={`ellipsis-${index}`} className="bolt-pag-ellipsis">
      ...
    </span>
  ) : (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`bolt-pag-btn ${page === currentPage ? 'bolt-pag-active' : ''}`}
    >
      {page}
    </button>
  )
)}

<button
  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
  disabled={currentPage === totalPages}
  className={`bolt-pag-btn ${currentPage === totalPages ? 'bolt-pag-disabled' : ''}`}
>
  <ChevronRight style={{ width: '16px', height: '16px' }} />
</button>
                </div>
              )}
            </>

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
