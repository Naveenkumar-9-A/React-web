import React, { useState, useEffect } from 'react';
import '../styles/Contact.css'; // Links directly to your external styles sheet

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    user_type: '',
    trek_category: '',
    comment: '',
  });
  const [contactInfo, setContactInfo] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [showTrekCategory, setShowTrekCategory] = useState(false);
  const [showVendorInfo, setShowVendorInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/contact-info/')
      .then(res => res.json())
      .then(data => setContactInfo(data))
      .catch(() => {});

    fetch('/api/social-media/')
      .then(res => res.json())
      .then(data => setSocialMedia(data))
      .catch(() => {});
  }, []);

  const handleUserType = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, user_type: val });
    setShowTrekCategory(val === 'trekker');
    setShowVendorInfo(val === 'organizer');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <main className="contact-page container py-5 mt-5">
      <div className="row g-4 align-items-center">
        
        {/* FORM MODULE CONTAINER */}
        <div className="col-lg-6">
          <div className="contact-card p-4">
            <h2 className="form-card-title mb-3">Get answers to your Questions</h2>
            <form id="contactForm" onSubmit={handleSubmit} noValidate>

              {/* Name Input Block */}
              <div className="input-group-custom mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control-custom" id="name" name="name"
                  pattern="^[A-Za-z\s]{2,50}$"
                  title="Name should only contain letters and spaces (2–50 characters)"
                  value={formData.name} onChange={handleChange} required />
                <div className="invalid-feedback">Please enter a valid name (2–50 letters only).</div>
              </div>

              {/* Email Input Block */}
              <div className="input-group-custom mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control-custom" id="email" name="email"
                  pattern="[a-zA-Z0-9._%+\-]+@gmail\.com"
                  title="Enter a valid Gmail address (example@gmail.com)"
                  value={formData.email} onChange={handleChange} required />
                <div className="invalid-feedback">Enter a valid Gmail address.</div>
              </div>

              {/* Mobile Input Block */}
              <div className="input-group-custom mb-3">
                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                <input type="tel" className="form-control-custom" id="mobile" name="mobile"
                  pattern="^[6-9][0-9]{9}$" maxLength="10" minLength="10"
                  title="Enter a valid 10-digit Indian mobile number starting with 6-9"
                  onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  value={formData.mobile} onChange={handleChange} required />
                <div className="invalid-feedback">Enter a valid 10-digit mobile number starting with 6–9.</div>
              </div>

              {/* User Type Selection Dropdown */}
              <div className="input-group-custom mb-3">
                <label htmlFor="user_type" className="form-label">I am a</label>
                <select id="user_type" name="user_type" className="form-select-custom"
                  onChange={handleUserType} value={formData.user_type} required>
                  <option value="">-- Select --</option>
                  <option value="trekker">Trekker</option>
                  <option value="organizer">Trek Organizer</option>
                  <option value="other">Other</option>
                </select>
                <div className="invalid-feedback">Please select your user type.</div>
              </div>

              {/* Trek Category Condition Module */}
              {showTrekCategory && (
                <div id="trek_category_div" className="input-group-custom mb-3 animate-slide-down">
                  <label htmlFor="trek_category" className="form-label">Trek Category</label>
                  <select name="trek_category" id="trek_category" className="form-select-custom"
                    value={formData.trek_category} onChange={handleChange}>
                    <option value="">-- Select Category --</option>
                    <option value="adventure">Adventure Treks</option>
                    <option value="weekend">Weekend Treks</option>
                    <option value="nature">Nature Escapes</option>
                    <option value="beach">Beach Treks</option>
                    <option value="camping">Camping Treks</option>
                    <option value="spiritual">Spiritual Treks</option>
                  </select>
                </div>
              )}

              {/* Vendor Partnership Redirect Link Module */}
              {showVendorInfo && (
                <div id="vendor_info_div" className="vendor-info-box mb-3 animate-slide-down">
                  <label className="form-label font-bold text-gold">Vendor Portal</label>
                  <p style={{ fontSize: '14px', margin: '0 0 8px 0' }}>
                    For partnership and onboarding, please visit our vendor portal.
                  </p>
                  <a href="https://www.partner.aorbotreks.co.in" target="_blank" rel="noreferrer" className="contact-link dynamic-underline">
                    www.partner.aorbotreks.co.in
                  </a>
                </div>
              )}

              {/* Message Comment Text Area Box */}
              <div className="input-group-custom mb-4">
                <label htmlFor="comment" className="form-label">Your Message</label>
                <textarea id="comment" name="comment" className="form-control-custom" rows="3"
                  minLength="10" maxLength="500"
                  title="Message should be between 10 and 500 characters"
                  value={formData.comment} onChange={handleChange} required></textarea>
                <div className="invalid-feedback">Message must be between 10–500 characters.</div>
              </div>

              <div className="text-center">
                <button type="submit" className="contact-submit-btn" id="submitBtn" disabled={submitting}>
                  <span>{submitting ? 'Submitting...' : 'Submit Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ILLUSTRATION BANNER SPLIT ROW CONTAINER */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center">
          <div className="contact-image-wrapper">
            <img src="/images/contact.webp" alt="Customer Support" className="contact-image" />
          </div>
        </div>
      </div>

      <hr className="divider-line my-5" />

      {/* COMPLAINTS & ESCALATION zone MATRIX */}
      <div className="row g-4 align-items-stretch">
        <div className="col-md-6 d-flex">
          <div className="card-custom w-100">
            <h4>Grievances</h4>
            <p>If you have any concerns or complaints about our services, please reach out to our dedicated grievance team.</p>
            <a href="mailto:Aorbotreks@gmail.com?subject=Issue Regarding the AorboTreks App"
              className="contact-link d-flex align-items-center mt-auto">
              <span className="icon-emoji">✉️</span>Send a message
            </a>
          </div>
        </div>
        <div className="col-md-6 d-flex">
          <div className="card-custom w-100">
            <h4>Ombudsman</h4>
            <p>Reach out to our regulatory authority via message for third-party complaint escalation procedures.</p>
            <a href="#" className="contact-link mt-auto inline-block">Know More →</a>
          </div>
        </div>
      </div>

      {/* SOCIAL NETWORKS ATTACHMENT CHANNEL ROW */}
      {socialMedia.length > 0 && (
        <div className="mt-5 social-connect-section">
          <h4>Connect With Us</h4>
          <div className="d-flex flex-wrap gap-3 mt-3">
            {socialMedia.map((social, i) => (
              <a key={i} href={social.url} className="social-network-circle"
                target="_blank" rel="noreferrer" title={social.name}>
                {social.icon ? (
                  <img src={social.icon} alt={social.name} className="social-icon" />
                ) : (
                  social.name
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* OFFICE DIRECTIONS & CONTACT DETAILS BASE ROW */}
      <div className="row g-4 mt-2 align-items-stretch">
        <div className="col-md-6 d-flex">
          <div className="card-custom w-100">
            <h4>Registered Address</h4>
            <div className="map-thumbnail-box">
              <img src="/images/map_loc.webp" alt="Map Icon" className="map-icon-img" />
            </div>
            {contactInfo ? (
              <div className="address-block-info">
                <address>
                  <strong>{contactInfo.company_name}</strong><br />
                  {contactInfo.address_line1}<br />
                  {contactInfo.address_line2}<br />
                  {contactInfo.registration_number && <span className="cin-text">CIN: {contactInfo.registration_number}</span>}
                </address>
                {contactInfo.map_link && (
                  <a href={contactInfo.map_link} target="_blank" rel="noreferrer"
                    className="contact-link d-flex align-items-center mt-3">
                    <span className="icon-emoji">📍</span> View in Maps
                  </a>
                )}
              </div>
            ) : (
              <div className="address-block-info">
                <address>
                  <strong>AORBO INFOCOM</strong><br />
                  Sri Krup Market<br />
                  Malakpet, Hyderabad, India, 500036<br />
                </address>
                <a href="https://maps.app.goo.gl/ZgXJtZU7XJ9BXkaZ9" target="_blank" rel="noreferrer"
                  className="contact-link d-flex align-items-center mt-3">
                  <span className="icon-emoji">📍</span> View in Maps
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="card-custom w-100">
            <h4>Customer Support</h4>
            {contactInfo ? (
              <div className="support-block-info d-flex flex-column h-100">
                <p>{contactInfo.support_description}</p>
                {contactInfo.whatsapp_number && (
                  <a href={`https://wa.me/${contactInfo.whatsapp_number}`} className="mt-2">
                    <button className="chat-btn-custom">Get Help <span className="arrow">→</span></button>
                  </a>
                )}
                <p className="support-text mt-3">To reach us by phone, tap below</p>
                {contactInfo.phone_number && (
                  <a href={`tel:+${contactInfo.phone_number}`} className="contact-link d-flex align-items-center mt-auto">
                    <span className="icon-emoji">☎️</span> Contact Us
                  </a>
                )}
              </div>
            ) : (
              <div className="support-block-info d-flex flex-column h-100">
                <p>Tap on your Aorbo Treks app Help screen and select a topic for quick assistance.</p>
                <a href="https://wa.me/9398093503" className="mt-2">
                  <button className="chat-btn-custom">Get Help <span className="arrow">→</span></button>
                </a>
                <p className="support-text mt-3">To reach us by phone, tap below</p>
                <a href="tel:+919398093503" className="contact-link d-flex align-items-center mt-auto">
                  <span className="icon-emoji">☎️</span> Contact Us
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lottie Overlay Modal Frame Layout Container */}
      <div id="lottieAnimation" className="lottie-animation">
        <div id="lottieContainer"></div>
      </div>
    </main>
  );
}