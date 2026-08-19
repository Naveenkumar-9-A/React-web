import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container-fluid p-0 px-3 px-lg-5">
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          <img src="/images/updated_logo.webp" alt="Aorbo" className="nav-logo" height="50" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-between ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto align-items-lg-center text-center">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/about') ? 'active' : ''}`} to="/about" onClick={closeMenu}>
                About us
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/blogs') ? 'active' : ''}`} to="/blogs" onClick={closeMenu}>
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/safety') ? 'active' : ''}`} to="/safety" onClick={closeMenu}>
                Safety
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} to="/contact" onClick={closeMenu}>
                Contact us
              </Link>
            </li>
          </ul>

          {/* Desktop Button */}
          <div className="d-none d-lg-block">
            <button className="btn download-btn">Coming Soon..</button>
          </div>

          {/* Mobile Button */}
          <div className="d-lg-none text-center mt-3 w-100">
            <button className="btn download-btn w-75 mx-auto" onClick={closeMenu}>
              Coming Soon..
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}