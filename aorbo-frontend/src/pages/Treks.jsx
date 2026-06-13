import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Treks() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management for search filters, results list, and pagination boundaries
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Sync state filters locally with browser URL search queries
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || '');
  const [durationFilter, setDurationFilter] = useState(searchParams.get('duration') || '');
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Django Python API routing path variables
  const BACKEND_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchFilteredTreks();
  }, [searchParams]);

  const fetchFilteredTreks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        state: stateFilter,
        duration: durationFilter
      }).toString();

      // Calling your Django server filter API endpoints
      const res = await fetch(`/api/treks/?${queryParams}`);
      const data = await res.json();

      setTreks(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Failed to load filter variations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      page: 1, // Reset filter lookups back to page 1
      state: stateFilter,
      duration: durationFilter
    });
  };

  const getPageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber);
    return `?${params.toString()}`;
  };

  // Self-contained inline layout parameter definitions
  const styles = {
    container: {
      maxWidth: '1440px',
      margin: '0 auto',
      padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 4vw, 5%) clamp(2rem, 4vw, 4rem)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f9fafb'
    },
    filtersForm: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'clamp(0.75rem, 2vw, 1rem)',
      alignItems: 'center',
      marginBottom: '3rem',
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    filterGroup: {
      flex: '1',
      minWidth: '200px'
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      color: '#333'
    },
    selectInput: {
      width: '100%',
      padding: '0.6rem',
      borderRadius: '5px',
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      fontSize: '0.95rem'
    },
    filterButton: {
      backgroundColor: '#FFFF00',
      color: '#333',
      border: 'none',
      borderRadius: '5px',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1.4rem',
      alignSelf: 'stretch'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Auto sizing card grids
      gap: 'clamp(1rem, 2vw, 2rem)'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    imageWrapper: {
      width: '100%',
      height: '200px',
      overflow: 'hidden',
      position: 'relative'
    },
    cardImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    difficultyBadge: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '0.3rem 0.6rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    cardContent: {
      padding: '1.5rem',
      flexGrow: 1
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      lineHeight: '1.4',
      color: '#111827'
    },
    locationRow: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '0.75rem'
    },
    detailsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      fontSize: '0.85rem',
      color: '#6b7280'
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      borderTop: '1px solid #f3f4f6',
      paddingTop: '1rem'
    },
    priceAmount: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#111827'
    },
    discountPrice: {
      fontSize: '0.9rem',
      color: '#999',
      textDecoration: 'line-through',
      marginRight: '0.5rem'
    },
    viewBtn: {
      backgroundColor: '#FFFF00',
      color: '#333',
      border: 'none',
      borderRadius: '5px',
      padding: '0.5rem 1rem',
      fontWeight: '600',
      textDecoration: 'none',
      fontSize: '0.9rem',
      textAlign: 'center'
    },
    pagination: {
      marginTop: '3rem',
      textAlign: 'center'
    },
    pagList: {
      display: 'inline-flex',
      listStyle: 'none',
      padding: 0,
      margin: 0,
      gap: '0.5rem'
    },
    pagItem: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      backgroundColor: '#f5f5f5',
      color: '#333',
      textDecoration: 'none',
      fontSize: '0.95rem'
    },
    activePagItem: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      backgroundColor: '#4A97FF',
      color: 'white',
      fontWeight: '600',
      fontSize: '0.95rem'
    },
    emptyMessageBox: {
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: '#f8f8f8',
      borderRadius: '10px'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. FILTER CONTROLS FORM */}
      <form style={styles.filtersForm} onSubmit={handleFilterSubmit}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Destination State</label>
          <select 
            style={styles.selectInput} 
            value={stateFilter} 
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">All States</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Duration Profile</label>
          <select 
            style={styles.selectInput} 
            value={durationFilter} 
            onChange={(e) => setDurationFilter(e.target.value)}
          >
            <option value="">Any Duration</option>
            <option value="short">Short Getaways (1-3 Days)</option>
            <option value="medium">Classic Trails (4-6 Days)</option>
            <option value="long">Expeditions (7+ Days)</option>
          </select>
        </div>

        <button type="submit" style={styles.filterButton}>
          Apply Filters
        </button>
      </form>

      {/* 2. TREK RESULTS GRID CONTAINER */}
      {loading ? (
        <div className="text-center py-5" style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading custom trails...</div>
      ) : treks.length > 0 ? (
        <div style={styles.grid}>
          {treks.map((trek) => {
            // Resolve dynamic vs placeholder static asset paths configurations
            const trekImg = trek.images && trek.images[0] && trek.images[0].image_url
              ? `${BACKEND_URL}${trek.images[0].image_url}`
              : '/images/default-trek.jpg';

            return (
              <div key={trek.id} style={styles.card}>
                <div style={styles.imageWrapper}>
                  <img src={trekImg} alt={trek.name} style={styles.cardImg} />
                  {trek.difficulty && (
                    <span style={styles.difficultyBadge}>{trek.difficulty.toUpperCase()}</span>
                  )}
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.title}>{trek.name}</h3>
                  <div style={styles.locationRow}>
                    <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', marginRight: '0.4rem', fill: '#6b7280' }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {trek.state}
                  </div>

                  <div style={styles.detailsRow}>
                    <span>⏱ {trek.duration_days} Days</span>
                    <span>👤 {trek.operators?.[0] || 'Verified Partner'}</span>
                  </div>

                  <div style={styles.priceRow}>
                    <div>
                      {trek.price_original && (
                        <span style={styles.discountPrice}>₹{trek.price_original}</span>
                      )}
                      <span style={styles.priceAmount}>₹{trek.price_start}</span>
                    </div>
                    <Link to={`/treks/${trek.id}`} style={styles.viewBtn}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyMessageBox}>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151', margin: '0 0 0.5rem' }}>No matching paths found.</p>
          <span style={{ color: '#6b7280' }}>Try shifting your search settings or clearing filters.</span>
        </div>
      )}

      {/* 3. PAGINATION CONTROLS NAVIGATION */}
      {!loading && totalPages > 1 && (
        <nav style={styles.pagination}>
          <ul style={styles.pagList}>
            {currentPage > 1 && (
              <li>
                <Link to={getPageUrl(currentPage - 1)} style={styles.pagItem}>← Prev</Link>
              </li>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageIdx) => (
              <li key={pageIdx}>
                <Link 
                  to={getPageUrl(pageIdx)} 
                  style={currentPage === pageIdx ? styles.activePagItem : styles.pagItem}
                >
                  {pageIdx}
                </Link>
              </li>
            ))}

            {currentPage < totalPages && (
              <li>
                <Link to={getPageUrl(currentPage + 1)} style={styles.pagItem}>Next →</Link>
              </li>
            )}
          </ul>
        </nav>
      )}

    </div>
  );
}