import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div id="cookie-banner" className="cookie-banner">
      <div className="cookie-text">
        🍪 We use cookies to personalize your experience.{' '}
        <Link to="/privacy-policy" className="text-decoration-underline text-light">
          Learn more
        </Link>
      </div>
      <div className="cookie-buttons mt-2 text-end">
        <button onClick={handleDecline} className="btn btn-outline-light btn-sm me-2">
          Decline
        </button>
        <button onClick={handleAccept} className="btn btn-success btn-sm">
          Accept
        </button>
      </div>
    </div>
  );
}