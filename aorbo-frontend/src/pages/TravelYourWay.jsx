import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function TravelYourWay() {
  const [searchParams] = useSearchParams();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grab the travel style tag from the browser context query string (?tag=adventure)
  const selectedTag = searchParams.get('tag') || 'Adventure';

  // Base domain variable for your Django back-end dynamic media loader
  const BACKEND_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchTreksByStyle();
  }, [selectedTag]);

  const fetchTreksByStyle = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/travel-your-way/?tag=${selectedTag}`);
      const data = await res.json();
      setTreks(data.results || []);
    } catch (err) {
      console.error('Failed to resolve custom category items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Self-contained design token maps to substitute separate CSS sheets completely
  const styles = {
    pageWrapper: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    // ================= HEADER STYLES =================
    travelHeader: {
      paddingTop: 'clamp(6rem, 15vw, 7.5rem)',
      paddingBottom: '3rem',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e5e7eb'
    },
    travelContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    },
    backLink: {
      fontWeight: '600',
      color: '#2563eb',
      textDecoration: 'none',
      fontSize: '0.95rem'
    },
    travelTitle: {
      fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
      fontWeight: '800',
      color: '#111827',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.25rem',
      lineHeight: '1.1',
      marginTop: '1rem',
      marginBottom: '0.5rem'
    },
    tagPill: {
      background: 'linear-gradient(135deg, #ff7a18, #ff3d00)',
      color: '#fff',
      padding: '10px 22px',
      borderRadius: '999px',
      fontSize: '0.85rem',
      fontWeight: '700',
      whiteSpace: 'nowrap', // 👈 Fixed the JavaScript object property name here
      marginTop: '0.45rem'
    },
    travelSubtitle: {
      color: '#4b5563',
      maxWidth: '640px',
      margin: 0,
      fontSize: '1rem'
    },
    // ================= LISTING STYLES =================
    trekListing: {
      backgroundColor: '#f1f6f7',
      padding: '3.5rem 0 4.5rem'
    },
    gridRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', // Automated row wrapping adaptivity
      gap: '2rem'
    },
    // ================= CARD DEFINITIONS =================
    premiumCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
      color: 'inherit',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    },
    imageWrapper: {
      position: 'relative',
      width: '100%',
      paddingTop: '75%', // Mimics standard Bootstrap framework mapping
      overflow: 'hidden'
    },
    imageInner: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden'
    },
    cardImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 0.5s ease'
    },
    pricePill: {
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      background: 'linear-gradient(135deg, #ff7a18, #ff3d00)',
      color: '#fff',
      padding: '8px 14px',
      borderRadius: '40px',
      boxShadow: '0 6px 16px rgba(0,0,0,.35)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '2px'
    },
    priceOnwards: {
      fontSize: '0.5rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
      opacity: '0.9'
    },
    priceValue: {
      fontSize: '0.95rem',
      fontWeight: '800',
      lineHeight: '1'
    },
    cardContent: {
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    locationText: {
      color: '#4b5563',
      fontWeight: '500',
      fontSize: '0.9rem',
      margin: '0 0 0.5rem 0'
    },
    days: {
      fontSize: '13px',
      color: '#374151',
      margin: '0 0 0.25rem 0'
    },
    operatorGridWrapper: {
      marginTop: 'auto',
      paddingTop: '0.75rem',
      borderTop: '1px solid #e5e7eb'
    },
    badgeContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    },
    operatorBadgePremium: {
      backgroundColor: '#f97316',
      color: '#ffffff',
      fontSize: '0.7rem',
      fontWeight: '600',
      padding: '5px 12px',
      borderRadius: '16px',
      border: 'none'
    }
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* Injecting Animation Keyframes into Document head dynamically for Floating Pill */}
      <style>{`
        @keyframes floatPrice {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animated-price-pill { animation: floatPrice 3s ease-in-out infinite; }
        .interactive-trek-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.12); }
        .interactive-trek-card:hover img { transform: scale(1.08); }
      `}</style>

      {/* ================= PAGE HEADER ================= */}
      <section style={styles.travelHeader}>
        <div style={styles.travelContainer}>
          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 style={styles.travelTitle}>
            Travel Your Way
            <span style={styles.tagPill}>
              {selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1).toLowerCase()}
            </span>
          </h1>
          <p style={styles.travelSubtitle}>
            Showing treks and trips that match your travel style.
          </p>
        </div>
      </section>

      {/* ================= TREKS LISTINGS CONTAINER ================= */}
      <section style={styles.trekListing}>
        <div style={styles.travelContainer}>
          {loading ? (
            <div className="text-center py-5" style={{ fontSize: '1.2rem', color: '#4b5563' }}>
              Filtering custom packages...
            </div>
          ) : treks.length > 0 ? (
            <div style={styles.gridRow}>
              {treks.map((trek) => {
                // Prepend Python backend base URL if it's a relative storage path
                const resolvedImageUrl = trek.images && trek.images[0] && trek.images[0].image_url
                  ? trek.images[0].image_url.startsWith('http') ? trek.images[0].image_url : `${BACKEND_URL}${trek.images[0].image_url}`
                  : '/images/placeholder-trek.jpg';

                return (
                  <Link 
                    to={`/treks/${trek.id}`} 
                    key={trek.id} 
                    style={styles.premiumCard}
                    className="interactive-trek-card"
                  >
                    {/* IMAGE FRAME */}
                    <div style={styles.imageWrapper}>
                      <div style={styles.imageInner}>
                        <img src={resolvedImageUrl} alt={trek.name} style={styles.cardImg} loading="lazy" />
                        <div style={styles.pricePill} className="animated-price-pill">
                          <span style={styles.priceOnwards}>Onwards*</span>
                          <span style={styles.priceValue}>₹{trek.price_start}</span>
                        </div>
                      </div>
                    </div>

                    {/* DETAILS CONTENT */}
                    <div style={styles.cardContent}>
                      <h5 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#111827' }}>
                        {trek.name.charAt(0).toUpperCase() + trek.name.slice(1).toLowerCase()}
                      </h5>
                      
                      <p style={styles.locationText}>📍 {trek.state}</p>
                      
                      <p style={styles.days}>
                        <strong>Duration:</strong> {trek.duration_days} Days
                      </p>
                      <p style={{ ...styles.days, marginBottom: '1rem' }}>
                        <strong>Departure:</strong> {trek.operating_days?.toUpperCase()}
                      </p>

                      {/* OPERATORS CHIP SUBGRID */}
                      {trek.operators && trek.operators.length > 0 && (
                        <div style={styles.operatorGridWrapper}>
                          <div style={styles.badgeContainer}>
                            {trek.operators.slice(0, 3).map((operator, idx) => (
                              <span key={idx} style={styles.operatorBadgePremium}>
                                {operator}
                              </span>
                            ))}
                            {trek.operators.length > 3 && (
                              <span style={styles.operatorBadgePremium}>
                                +{trek.operators.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5" style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '3rem' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                No active trails matching this category at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}