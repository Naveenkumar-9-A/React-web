import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  // Directly embedded CSS to avoid external stylesheet dependencies
  const styles = {
    footer: {
      backgroundColor: '#1e293b', // Deep elegant dark slate profile color
      color: '#cbd5e1',
      padding: '3.5rem 1rem 1.5rem',
      marginTop: '5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '3rem',
      justifyContent: 'space-between'
    },
    footerLeft: {
      flex: '1 1 320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem'
    },
    footerLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    logoImg: {
      height: '45px',
      width: 'auto',
      borderRadius: '8px'
    },
    logoTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#ffffff',
      margin: 0
    },
    description: {
      fontSize: '0.92rem',
      lineHeight: '1.6',
      color: '#94a3b8',
      margin: 0
    },
    appButtons: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '0.5rem'
    },
    appBtnImg: {
      height: '40px',
      width: 'auto',
      borderRadius: '5px'
    },
    // Right Columns Wrapper Layout Map
    footerRight: {
      flex: '2 1 600px'
    },
    footerLinksGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2.5rem',
      justifyContent: 'space-between'
    },
    footerColumn: {
      flex: '1 1 160px'
    },
    columnHeading: {
      fontSize: '1.05rem',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '1.2rem',
      letterSpacing: '0.03em'
    },
    linkList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    // Social Links Container
    socialIconsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      alignItems: 'center'
    },
    socialIconImg: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#334155',
      padding: '8px',
      objectFit: 'contain',
      transition: 'background-color 0.2s ease'
    },
    // Bottom Bar
    footerBottom: {
      maxWidth: '1200px',
      margin: '2.5rem auto 0',
      paddingTop: '1.5rem',
      borderTop: '1px solid #334155',
      textAlign: 'center'
    },
    copyrightText: {
      fontSize: '0.85rem',
      color: '#64748b',
      margin: 0
    }
  };

  return (
    <footer style={styles.footer}>
      {/* Dynamic hover color classes injected cleanly into root head */}
      <style>{`
        .footer-nav-link { color: #94a3b8; text-decoration: none; font-size: 0.92rem; transition: color 0.2s; }
        .footer-nav-link:hover { color: #38bdf8; }
        .social-link-item:hover img { background-color: #f97316 !important; }
      `}</style>

      <div style={styles.footerContent}>
        {/* LEFT COLUMN: BRAND INFO */}
        <div style={styles.footerLeft}>
          <div style={styles.footerLogo}>
            <img src="/images/updated_logo.webp" alt="Aorbo Treks" style={styles.logoImg} />
            <h3 style={styles.logoTitle}>Aorbo Treks</h3>
          </div>
          <p style={styles.description}>
            Aorbo Treks helps travellers find and book treks easily by connecting them with trusted trek organizers.
            Whether you're going solo or with a group, we make trekking simple and hassle-free. 🗺💕
          </p>
          <div style={styles.appButtons}>
  <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
    <img src="/images/Vector.webp" alt="Get it on Google Play" style={styles.appBtnImg} />
  </a>
  <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
    <img src="/images/Vector-1.webp" alt="Download on App Store" style={styles.appBtnImg} />
  </a>
</div>
        </div>

        {/* RIGHT COLUMN: LINKS NAVIGATION */}
        <div style={styles.footerRight}>
          <div style={styles.footerLinksGrid}>
            
            <div style={styles.footerColumn}>
              <h4 style={styles.columnHeading}>About Aorbo</h4>
              <ul style={styles.linkList}>
                <li><Link to="/about" className="footer-nav-link">About us</Link></li>
                <li><Link to="/contact" className="footer-nav-link">Contact us</Link></li>
              </ul>
            </div>

            <div style={styles.footerColumn}>
              <h4 style={styles.columnHeading}>Information</h4>
              <ul style={styles.linkList}>
                <li><Link to="/terms" className="footer-nav-link">T&amp;C</Link></li>
                <li><Link to="/privacy-policy" className="footer-nav-link">Privacy Policy</Link></li>
                <li><Link to="/blogs" className="footer-nav-link">Blogs</Link></li>
                <li><Link to="/user-agreement" className="footer-nav-link">User Agreement</Link></li>
                <li><a href="#" className="footer-nav-link">Insurance Partner</a></li>
              </ul>
            </div>

            <div style={styles.footerColumn}>
              <h4 style={styles.columnHeading}>Follow our socials</h4>
              <div style={styles.socialIconsRow}>
                <a href="https://www.instagram.com/aorbo_treks_official?igsh=MWFlYXo4eGUzeDRoeQ==" target="_blank" rel="noreferrer" className="social-link-item">
                  <img src="/images/Instagram.webp" alt="Instagram" style={styles.socialIconImg} />
                </a>
                <a href="https://www.quora.com/profile/Aorbo-Treks?ch=3&oid=2916133467&share=ad038b63&srid=uPcJFO&target_type=user" target="_blank" rel="noreferrer" className="social-link-item">
                  <img src="/images/Quora.webp" alt="Quora" style={styles.socialIconImg} />
                </a>
                <a href="https://www.facebook.com/share/1EdiBukgY4/" target="_blank" rel="noreferrer" className="social-link-item">
                  <img src="/images/Facebook.webp" alt="Facebook" style={styles.socialIconImg} />
                </a>
                <a href="https://x.com/Aorbo_treks?t=PeDDeVp4OHZ6qvESNbsWbg&s=08" target="_blank" rel="noreferrer" className="social-link-item">
                  <img src="/images/X.webp" alt="X" style={styles.socialIconImg} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM LOG */}
      <div style={styles.footerBottom}>
        <p style={styles.copyrightText}>&copy; 2024 - All rights reserved</p>
      </div>
    </footer>
  );
}