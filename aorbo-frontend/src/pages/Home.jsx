import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Clock, Calendar, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
// import TrekMap from '../components/TrekMap';
// import DestinationCard from '../components/DestinationCard';
// import { useEnhancedSearch } from '../hooks/useEnhancedSearch';
import { generateSlug } from '../utils/slugUtils';
import '../styles/Home.css';

export default function Home() {
  const [featuredTreks, setFeaturedTreks] = useState([]);
  const [allTreksForSearch, setAllTreksForSearch] = useState([]); // 🔍 All treks for search (not paginated)
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  // const [showHeroMap, setShowHeroMap] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const suggestionRef = useRef(null);
  const allTreksFetched = useRef(false); // 🔍 Track if we've fetched all treks

  // Define BACKEND_URL first!
  const BACKEND_URL = 'http://127.0.0.1:8000';

// const {
//   filteredTreks,
//   osmResults,
//   highlightedTrekId,
//   isLoading,
//   loadingMessage,
//   errorMessage,
//   handleSearch,
//   handleMapMarkerClick,
//   clearSearch,
// } = useEnhancedSearch(allTreksForSearch, BACKEND_URL); // 🔍 Search against ALL treks with backend URL for AI enrichment


  useEffect(() => {
    const tag = searchParams.get('tag') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    setSelectedTag(tag);
    setCurrentPage(page);
    fetchTreks(page, tag);
    
    // 🔍 Fetch all treks for search (only once on mount)
    if (!allTreksFetched.current) {
      fetchAllTreksForSearch();
      allTreksFetched.current = true;
    }
  }, [searchParams]);

  const fetchTreks = async (page = 1, tag = '') => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/treks/?page=${page}&tag=${tag}`);
      const data = await res.json();
      setFeaturedTreks(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Failed to fetch treks from database', err);
    }
  };

// 🔍 Fetch ALL treks for search (no pagination) - called once on mount
const fetchAllTreksForSearch = async () => {
  try {
    const allTreks = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 10) {
      const res = await fetch(`${BACKEND_URL}/api/treks/?page=${page}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        allTreks.push(...data.results);
        page++;
        hasMore = page <= (data.total_pages || 1);
      } else {
        hasMore = false;
      }
    }

    setAllTreksForSearch(allTreks);
    console.log(`✅ Loaded ${allTreks.length} treks for search functionality`);
  } catch (err) {
    console.error('Failed to fetch all treks for search', err);
  }
};

const debounceRef = useRef(null);
const latestQueryRef = useRef('');
const handleSearchInput = (e) => {
  const val = e.target.value;
  setSearchQuery(val);

  if (val.length < 2) {
    console.log(`[${Date.now()}] Clearing suggestions, val too short: "${val}"`);
    setSuggestions([]);
    setShowSuggestions(false);
    clearTimeout(debounceRef.current);
    return;
  }

  clearTimeout(debounceRef.current);
  latestQueryRef.current = val;

  debounceRef.current = setTimeout(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/treks/search/?q=${val}`);
      const data = await res.json();
      const trekSuggestions = Array.isArray(data) ? data : [];

      // Ignore this response if the user has typed something new since this search started
      if (latestQueryRef.current !== val) return;

      if (trekSuggestions.length > 0) {
        setSuggestions(trekSuggestions.slice(0, 8));
        setShowSuggestions(true);
        return;
      }

      const osmRes = await fetch(`${BACKEND_URL}/api/search/intelligent/?q=${val}`);
      const osmData = await osmRes.json();
      const osmMatches = Array.isArray(osmData.results) ? osmData.results : [];

      // Ignore this response too if a newer search has since started
      if (latestQueryRef.current !== val) return;

      const osmSuggestions = osmMatches.slice(0, 5).map((r, idx) => ({
        id: `osm-${idx}`,
        name: r.name,
        display_name: r.display_name,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        category: r.category,
        type: 'osm',
      }));

      if (osmSuggestions.length > 0) {
        setSuggestions(osmSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([
          {
            id: "no-results",
            type: "no-results",
            message: "No trekking destinations found"
          }
        ]);

        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSuggestions([]);
    }
  }, 500);
};
 const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // Don't navigate if there are no trekking results
    if (
        suggestions.length === 1 &&
        suggestions[0].type === "no-results"
    ) {
        return;
    }

    if (suggestions.length > 0) {
        const first = suggestions[0];

        // Existing Trek
        if (first.type !== "osm") {
            fetch(`${BACKEND_URL}/api/treks/log-click/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    trek_id: first.id,
                    query: searchQuery,
                }),
            }).catch(() => {});

            navigate(`/treks/${first.id}`);
            setShowSuggestions(false);
            return;
        }

        // OpenStreetMap Trek — save as draft for the team to review later
        fetch(`${BACKEND_URL}/api/treks/create-from-osm/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: first.name,
            display_name: first.display_name,
            lat: first.lat,
            lon: first.lon,
            category: first.category,
          }),
        }).catch(() => {});

        const slug = generateSlug(first.name);

        navigate(`/destination/${slug}`, {
            state: {
                destination: first,
            },
        });

        setShowSuggestions(false);
        return;
    }

    // Do nothing
    return;
};

const handleSuggestionClick = (suggestion) => {
  fetch(`${BACKEND_URL}/api/treks/log-click/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      trek_id: suggestion.id || null,
      query: searchQuery,
      source: suggestion.type === 'osm' ? 'osm' : 'database',
    }),
  }).catch((err) => console.log("Click log failed:", err));

  if (suggestion.type === 'osm') {
    // Save as a draft for the team to review later — fire and forget
    fetch(`${BACKEND_URL}/api/treks/create-from-osm/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: suggestion.name,
        display_name: suggestion.display_name,
        lat: suggestion.lat,
        lon: suggestion.lon,
        category: suggestion.category,
      }),
    }).catch(() => {});

    const slug = generateSlug(suggestion.name);
    navigate(`/destination/${slug}`, { state: { destination: suggestion } });
  } else {
    navigate(`/treks/${suggestion.id}`);
  }

  setShowSuggestions(false);
  setSearchQuery('');
};
// ✅ Handle tag click (from main branch)
const handleTagClick = (tag) => {
  fetch(`${BACKEND_URL}/api/treks/log-click/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: '',
      tag: tag,
    }),
  }).catch((err) => console.log("Tag log failed:", err));
};

// ✅ Handle map marker click
// const handleMapMarkerClickWithNav = (trek) => {
//   handleMapMarkerClick(trek);

//   if (!trek.id) return;

//   if (String(trek.id).startsWith('osm-')) {
//     const slug = generateSlug(trek.name);

//     navigate(`/destination/${slug}`, {
//       state: {
//         source: 'osm',
//         destination: trek,
//       },
//     });
//   } else {
//     navigate(`/treks/${trek.id}`);
//   }
// };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <>
      {/* ANIMATION STYLES */}
      <style>{`
        @keyframes floatPrice {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animated-price-pill { animation: floatPrice 3s ease-in-out infinite; }
        .interactive-trek-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.12); }
        .interactive-trek-card:hover img { transform: scale(1.08); }
      `}</style>

      {/* ============ 1. HERO SECTION WITH FULL-SCREEN CAROUSEL ============ */}
      <section className="hero-landing p-0">
        <div id="heroCarousel" className="carousel slide hero-carousel" data-bs-ride="carousel" data-bs-interval="4000">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/images/hero_1.webp" className="d-block w-100 hero-img" alt="Ayodhya + Varanasi + Mathura" />
            </div>
            <div className="carousel-item">
              <img src="/images/hero_2.webp" className="d-block w-100 hero-img" alt="Badrinath" loading="lazy" />
            </div>
            <div className="carousel-item">
              <img src="/images/hero_3.webp" className="d-block w-100 hero-img" alt="Coorg" loading="lazy" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="hero-overlay-content">
          <div className="text-center">
            <div className="hero-badge mb-3">AORBO TREKS</div>
            <h1 className="hero-heading mb-3">Discover Your Adventure</h1>
            <p className="hero-subtitle mb-4">
              Search for your next trek or destination and start planning an unforgettable experience.
            </p>


            <form
              className="hero-search-form"
              onSubmit={handleSearchSubmit}
            >

              <div className="hero-search-wrapper" ref={suggestionRef}>
                <input
                  type="text"
                  name="q"
                  id="hero-search-input"
                  className="hero-search-input"
                  placeholder="Search for a destination or trek..."
                  autoComplete="off"
                  value={searchQuery}
                  onChange={handleSearchInput}
                />

                <button type="submit" className="hero-search-button" aria-label="Search">
                  <svg xmlns="http://www.w3.org/2000/svg" className="hero-search-icon" viewBox="0 0 24 24">
                    <path d="M10 4a6 6 0 0 1 4.8 9.6l3.8 3.8a1 1 0 0 1-1.4 1.4l-3.8-3.8A6 6 0 1 1 10 4zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                  </svg>
                </button>
                {showSuggestions && suggestions.length > 0 && (
  <div
    id="search-suggestions"
    className="search-suggestions"
    style={{ display: "block" }}
  >
    {suggestions.map((suggestion) => {

      if (suggestion.type === "no-results") {
        return (
          <div
            key="no-results"
            className="search-suggestion-item"
            style={{
              padding: "14px",
              textAlign: "center",
              color: "#666",
              cursor: "default"
            }}
          >
            ❌ No trekking destinations found
          </div>
        );
      }

      return (
        <div
          key={`${suggestion.type || "trek"}-${suggestion.id}`}
          className="search-suggestion-item"
          onClick={() => handleSuggestionClick(suggestion)}
          style={{
            cursor: "pointer",
            padding: "10px 12px",
            borderBottom: "1px solid #eee"
          }}
        >
          {suggestion.type === "osm" ? (
            <>
              <span className="search-suggestion-main">
                📍 {suggestion.name}
              </span>
              <span className="search-suggestion-secondary">
                {suggestion.display_name?.substring(0, 60)}...
              </span>
            </>
          ) : (
            <>
              <span className="search-suggestion-main">
                🏔️ {suggestion.label || suggestion.name}
              </span>
              <span className="search-suggestion-secondary">
                {suggestion.state || "Trek"}
              </span>
            </>
          )}
        </div>
      );
    })}
  </div>
)}
              </div>
            </form>

            {/*🗺️ ENHANCED: OpenStreetMap with Trek Database + Nominatim Results
             {showHeroMap && searchQuery.length >= 2 && (
              <div style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0' }}>
                {/* Search Status 
                {isLoading && filteredTreks.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: '#fef3c7', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    fontSize: '13px',
                    color: '#92400e'
                  }}>
                    🔍 {loadingMessage || 'Searching for locations...'}
                  </div>
                )}

                {/* Trek Results Found 
                {filteredTreks.length > 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '0.8rem', 
                    background: '#dcfce7', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    fontSize: '13px',
                    color: '#166534'
                  }}>
                    ✅ Found {filteredTreks.length} trek package{filteredTreks.length !== 1 ? 's' : ''} in "{searchQuery}"
                  </div>
                )}

                {/* OSM Results Found 
                {osmResults.length > 0 && filteredTreks.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '0.8rem', 
                    background: '#dbeafe', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    fontSize: '13px',
                    color: '#1e40af'
                  }}>
                    📍 Showing destination results from OpenStreetMap for "{searchQuery}"
                  </div>
                )}

                {/* No Results 
                {!isLoading && filteredTreks.length === 0 && osmResults.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: '#fee2e2', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    fontSize: '13px',
                    color: '#991b1b'
                  }}>
                    ❌ {errorMessage || `No results found for "${searchQuery}"`}
                  </div>
                )}

                {/* Map Component 
                <TrekMap
                  treks={filteredTreks}
                  osmResults={osmResults}
                  searchedLocation={searchQuery}
                  onMarkerClick={handleMapMarkerClickWithNav}
                  highlightedTrekId={highlightedTrekId}
                />

                {/* OSM Destination Cards 
                {osmResults.length > 0 && filteredTreks.length === 0 && (
                  <div style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0' }}>
                    <h4 style={{ 
                      color: '#ffffff', 
                      marginBottom: '1rem',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      Destination Details
                    </h4>
                    {osmResults.map((destination) => (
                      <DestinationCard key={destination.id} destination={destination} searchQuery={searchQuery} />
                    ))}
                  </div>
                )}
              </div>
            )} */}
          </div>
        </div>
      </section>

      {/* ============ 2. FEATURED DESTINATIONS (REFINED SLATE BLUE THEME) ============ */}
      <section className="py-5" id="featured-destinations" style={{ backgroundColor: '#121824' }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2 text-white">Featured Destinations</h2>

          {selectedTag ? (
            <p className="text-center text-muted mb-4">
              Showing results for{' '}
              <span className="fw-semibold text-warning">
                {selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1)}
              </span>
              <Link to="/#featured-destinations" className="ms-2 small text-warning text-decoration-none"> Reset </Link>
            </p>
          ) : (
            <p className="text-center text-light text-opacity-50 mb-5">
              Explore our most loved treks and travel circuits across India.
            </p>
          )}

          {/* ALWAYS SHOW FEATURED TREKS - NOT AFFECTED BY SEARCH */}
          <div className="row g-4" id="featured-trek-grid">
            {featuredTreks && featuredTreks.length > 0 ? (
              featuredTreks.map((trek, index) => {
                const resolvedImageUrl = trek.images && trek.images[0] && trek.images[0].image_url
                  ? trek.images[0].image_url.startsWith('http')
                    ? trek.images[0].image_url
                    : `${BACKEND_URL}${trek.images[0].image_url}`
                  : '/images/placeholder-trek.jpg';

                return (
                  <div
                    key={trek.id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                  >
                    <Link to={`/treks/${trek.id}`}  className="text-decoration-none d-block h-100"
                    onClick={() => {
                         fetch(`${BACKEND_URL}/api/treks/log-click/`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ trek_id: trek.id, query: '', tag: selectedTag || '' })
                    });
                    }}
                  >
                      <div className="bolt-premium-card">
                        
                        {/* Glow and Shimmer Lines */}
                        <div className="bolt-shine" />
                        <div className="bolt-top-glow" />

                        {/* Image Wrap (No Featured Tag) */}
                        <div className="bolt-image-wrapper">
                          <img
                            src={resolvedImageUrl}
                            alt={trek.name}
                            loading="lazy"
                            className="bolt-card-img"
                          />
                          <div className="bolt-image-overlay" />
                          <div className="bolt-image-shimmer" />

                          {/* Pricing Elements Badge */}
                          <div className="bolt-price-badge">
                            <p className="bolt-price-onwards">Onwards*</p>
                            <p className="bolt-price-value">₹{trek.price_start?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        {/* Card Info Content */}
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

                          {/* Duration and Calendar fields */}
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

                          {/* Custom Partner Footer Bar*/}
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
              })
            ) : (
              <div className="text-center py-5 w-100 text-muted">
                Connecting to Django server endpoints... Check your database connection if cards remain empty.
              </div>
            )}
          </div>

          {/* Premium Pagination Module */}
          {totalPages > 1 && (
            <div className="bolt-pagination-wrapper">
              <Link
                to={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
                className={`bolt-pag-btn ${currentPage === 1 ? 'bolt-pag-disabled' : ''}`}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </Link>

              {getPaginationPages().map((page, i) =>
                page === '...' ? (
                  <span key={`ell-${i}`} className="bolt-pag-ellipsis">···</span>
                ) : (
                  <Link
                    key={page}
                    to={getPageUrl(page)}
                    className={`bolt-pag-btn ${page === currentPage ? 'bolt-pag-active' : ''}`}
                  >
                    {page}
                  </Link>
                )
              )}

              <Link
                to={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
                className={`bolt-pag-btn ${currentPage === totalPages ? 'bolt-pag-disabled' : ''}`}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============ 3. TRAVEL YOUR WAY SECTION ============ */}
      <section className="travel-your-way mt-1 py-5">
        <div className="container text-center">
          <h2 className="tyw-title mb-2">Travel Your Way</h2>
          <p className="tyw-subtitle mb-4">
            Whether you seek adventure, peace, or a quick weekend escape, find the journey that fits your style.
          </p>
          <div className="row g-4 justify-content-center mt-3">
            {[
              { tag: 'adventure', icon: '⛰️', title: 'Adventure Treks', text: 'For thrill-seekers and explorers who crave a challenge.', iconClass: 'icon-adventure' },
              { tag: 'weekend', icon: '🌄', title: 'Weekend Getaways', text: 'Perfect short escapes to unwind and recharge.', iconClass: 'icon-weekend' },
              { tag: 'nature', icon: '🌲', title: 'Nature Escapes', text: 'Reconnect with nature through calm and scenic trails.', iconClass: 'icon-nature' },
              { tag: 'beach', icon: '🌊', title: 'Beach Trails', text: 'Walk along the coast, enjoy sunsets, and feel the sea breeze.', iconClass: 'icon-beach' },
              { tag: 'spiritual', icon: '💗', title: 'Spiritual Journeys', text: 'Find peace and purpose through sacred trails.', iconClass: 'icon-spiritual' },
              { tag: 'camping', icon: '🏕️', title: 'Camping & Bonfire', text: 'Experience starlit nights and warm bonfires in the wild.', iconClass: 'icon-camping' },
            ].map(({ tag, icon, title, text, iconClass }) => (
              <div key={tag} className="col-12 col-md-6 col-lg-4 d-flex">
                <Link to={`/travel-your-way?tag=${tag}`} className="tyw-card-link w-100" onClick={() => handleTagClick(tag)}>
                  <div className="tyw-card">
                    <div className={`tyw-icon ${iconClass}`}>{icon}</div>
                    <h3 className="tyw-card-title">{title}</h3>
                    <p className="tyw-card-text">{text}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. WHY TREK WITH AORBO TREKS SECTION ============ */}
      <section className="why-trek py-5">
        <div className="container text-center">
          <h2 className="why-title mb-3">Why Trek With AORBO TREKS?</h2>
          <p className="why-subtitle mb-5">
            We're more than a platform; we are your trusted partner in adventure, committed to making every journey safe, seamless, and unforgettable.
          </p>
          <div className="row g-4 justify-content-center">
            {[
              { icon: '🎯', title: 'Tailored Experience', text: 'Customize your trek according to your preferences and comfort level.' },
              { icon: '✔', title: 'Verified Local Operators', text: 'Every trek is led by trusted, certified local experts who ensure your safety and provide an authentic experience.' },
              { icon: '⛰', title: 'Unmatched Trek Variety', text: 'From serene weekend getaways to challenging Himalayan expeditions, find the perfect trail for your adventure style.' },
              { icon: '👥', title: 'Community & Support', text: 'Join a community of passionate adventurers with 24/7* support from a team that lives and breathes the outdoors.' },
            ].map(({ icon, title, text }) => (
              <div key={title} className="col-12 col-md-6 col-lg-3 d-flex">
                <div className="why-card">
                  <div className="why-icon-circle icon-local">{icon}</div>
                  <h3 className="why-card-title">{title}</h3>
                  <p className="why-card-text">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}