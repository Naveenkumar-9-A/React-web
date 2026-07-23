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
    <>
      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: #1a2e1a;
          color: #f5f5f5;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
          font-size: 14px;
        }
        .cookie-banner .cookie-text {
          flex: 1;
          min-width: 240px;
        }
        .cookie-banner .cookie-text a {
          color: #FFE100;
        }
        .cookie-banner .cookie-buttons {
          display: flex;
          gap: 8px;
          margin-top: 0;
        }
        @media (max-width: 480px) {
          .cookie-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .cookie-banner .cookie-buttons {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>

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
    </>
  );
}