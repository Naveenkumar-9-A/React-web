import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const [featuredTreks, setFeaturedTreks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const suggestionRef = useRef(null);

  // 🛰️ BASE DOMAIN URL to map dynamic images from your active Django backend
  const BACKEND_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const tag = searchParams.get('tag') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    setSelectedTag(tag);
    setCurrentPage(page);
    fetchTreks(page, tag);
  }, [searchParams]);

  const fetchTreks = async (page = 1, tag = '') => {
    try {
      // Added absolute backend server path mapping
      const res = await fetch(`${BACKEND_URL}/api/treks/?page=${page}&tag=${tag}`);
      const data = await res.json();
      setFeaturedTreks(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Failed to fetch treks from database', err);
    }
  };

  const handleSearchInput = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/treks/search/?q=${val}`);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/travel-your-way?q=${searchQuery}`);
  };

  const handleSuggestionClick = (trek) => {
    navigate(`/treks/${trek.id}`);
    setShowSuggestions(false);
  };

  // Close suggestions on outside click
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

  return (
    <>
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

            {/* Search with dropdown suggestions */}
            <form className="hero-search-form" onSubmit={handleSearchSubmit}>
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
                  <div id="search-suggestions" className="search-suggestions" style={{ display: 'block' }}>
                    {suggestions.map((trek) => (
                      <div
                        key={trek.id}
                        className="search-suggestion-item"
                        onClick={() => handleSuggestionClick(trek)}
                      >
                        <span className="search-suggestion-main">{trek.name}</span>
                        <span className="search-suggestion-secondary">{trek.state}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ============ 2. FEATURED DESTINATIONS ============ */}
      <section className="py-4 secondbg" id="featured-destinations">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Featured Destinations</h2>

          {selectedTag ? (
            <p className="text-center text-muted mb-4">
              Showing results for{' '}
              <span className="fw-semibold text-dark">
                {selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1)}
              </span>
              <Link to="/#featured-destinations" className="ms-2 small"> Reset </Link>
            </p>
          ) : (
            <p className="text-center text-muted mb-4">
              Explore our most loved treks and travel circuits across India.
            </p>
          )}

          <div className="row g-3" id="featured-trek-grid">
            {featuredTreks.length > 0 ? (
              featuredTreks.map((trek, index) => {
                // Prepend Python backend storage root URL if it's a relative path lookup
                const resolvedImageUrl = trek.images && trek.images[0] && trek.images[0].image_url
                  ? trek.images[0].image_url.startsWith('http') ? trek.images[0].image_url : `${BACKEND_URL}${trek.images[0].image_url}`
                  : '/images/placeholder-trek.jpg';

                return (
                  <div
                    key={trek.id}
                    className={`col-12 col-sm-6 col-md-4 col-lg-3 ${index >= 8 ? 'extra-trek-card d-none' : ''}`}
                  >
                    <Link
                      to={`/treks/${trek.id}`}
                      className="premium-card h-100 w-100 rounded-4 overflow-hidden text-decoration-none text-dark d-block"
                    >
                      {/* IMAGE CONTAINER FRAME */}
                      <div className="trek-card-image-wrapper ratio ratio-4x3">
                        <div className="image-inner">
                          <img src={resolvedImageUrl} alt={trek.name} loading="lazy" />
                          <div className="price-pill">
                            <div className="price-onwards">Onwards*</div>
                            <div className="price-value">₹{trek.price_start}</div>
                          </div>
                        </div>
                      </div>

                      {/* CONTENT DETAILS BAR */}
                      <div className="p-3 card-content">
                        <div>
                          <h5 className="fw-bold mb-1">
                            {trek.name.charAt(0).toUpperCase() + trek.name.slice(1).toLowerCase()}
                          </h5>
                          <p className="small mb-2 location-text">📍 {trek.state}</p>
                          <p className="small mb-1 days"><strong>Duration:</strong> {trek.duration_days} Days</p>
                          <p className="small mb-2 days"><strong>Departure:</strong> {trek.operating_days?.toUpperCase()}</p>
                        </div>

                        {/* TRUSTED INDIE OPERATORS CHIP FOOTER */}
                        {trek.operators && trek.operators.length > 0 && (
                          <div className="operator-grid-wrapper border-top pt-2 mt-2">
                            <div className="d-flex flex-wrap justify-content-center gap-1">
                              {trek.operators.slice(0, 3).map((op, i) => (
                                <span key={i} className="operator-badge-premium">{op}</span>
                              ))}
                              {trek.operators.length > 3 && (
                                <span className="operator-badge-premium">+{trek.operators.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
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

          {/* PAGINATION ENGINE CONTROLS */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center align-items-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  {currentPage > 1 ? (
                    <Link className="page-link" to={getPageUrl(currentPage - 1)}>‹</Link>
                  ) : (
                    <span className="page-link">‹</span>
                  )}
                </li>

                <li className="page-item d-sm-none active">
                  <span className="page-link">{currentPage}</span>
                </li>

                {currentPage > 2 && (
                  <li className="page-item d-none d-sm-inline">
                    <Link className="page-link" to={getPageUrl(1)}>1</Link>
                  </li>
                )}
                {currentPage > 3 && (
                  <li className="page-item disabled d-none d-sm-inline">
                    <span className="page-link">…</span>
                  </li>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(i => i >= currentPage - 1 && i <= currentPage + 1)
                  .map(i => (
                    <li key={i} className={`page-item d-none d-sm-inline ${currentPage === i ? 'active' : ''}`}>
                      <Link className="page-link" to={getPageUrl(i)}>{i}</Link>
                    </li>
                  ))}

                {currentPage < totalPages - 2 && (
                  <li className="page-item disabled d-none d-sm-inline">
                    <span className="page-link">…</span>
                  </li>
                )}
                {currentPage < totalPages - 1 && (
                  <li className="page-item d-none d-sm-inline">
                    <Link className="page-link" to={getPageUrl(totalPages)}>{totalPages}</Link>
                  </li>
                )}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  {currentPage < totalPages ? (
                    <Link className="page-link" to={getPageUrl(currentPage + 1)}>›</Link>
                  ) : (
                    <span className="page-link">›</span>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>

      {/* ============ 3. TRAVEL YOUR WAY SECTION ============ */}
      <section className="travel-your-way mt-1 py-5">
        <div className="container text-center">
          <h2 className="tyw-title mb-2">Travel Your Way</h2>
          <p className="tyw-subtitle mb-4">
            Whether you seek adventure, peace, or a quick weekend escape,
            find the journey that fits your style.
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
                <Link to={`/travel-your-way?tag=${tag}`} className="tyw-card-link w-100">
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
            We're more than a platform; we are your trusted partner in adventure,
            committed to making every journey safe, seamless, and unforgettable.
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