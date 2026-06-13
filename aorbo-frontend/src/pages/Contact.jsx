import { useState, useEffect } from 'react';
import '../styles/Contact.css';

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
    <main className="container py-5 mt-5">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm p-4">
            <h2 className="mb-3">Get answers to your Questions</h2>
            <form id="contactForm" onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className="mb-2">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name="name"
                  pattern="^[A-Za-z\s]{2,50}$"
                  title="Name should only contain letters and spaces (2–50 characters)"
                  value={formData.name} onChange={handleChange} required />
                <div className="invalid-feedback">Please enter a valid name (2–50 letters only).</div>
              </div>

              {/* Email */}
              <div className="mb-2">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email"
                  pattern="[a-zA-Z0-9._%+\-]+@gmail\.com"
                  title="Enter a valid Gmail address (example@gmail.com)"
                  value={formData.email} onChange={handleChange} required />
                <div className="invalid-feedback">Enter a valid Gmail address.</div>
              </div>

              {/* Mobile */}
              <div className="mb-2">
                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                <input type="tel" className="form-control" id="mobile" name="mobile"
                  pattern="^[6-9][0-9]{9}$" maxLength="10" minLength="10"
                  title="Enter a valid 10-digit Indian mobile number starting with 6-9"
                  onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  value={formData.mobile} onChange={handleChange} required />
                <div className="invalid-feedback">Enter a valid 10-digit mobile number starting with 6–9.</div>
              </div>

              {/* User Type */}
              <div className="mb-2">
                <label htmlFor="user_type" className="form-label">I am a</label>
                <select id="user_type" name="user_type" className="form-select"
                  onChange={handleUserType} value={formData.user_type} required>
                  <option value="">-- Select --</option>
                  <option value="trekker">Trekker</option>
                  <option value="organizer">Trek Organizer</option>
                  <option value="other">Other</option>
                </select>
                <div className="invalid-feedback">Please select your user type.</div>
              </div>

              {/* Trek Category */}
              {showTrekCategory && (
                <div id="trek_category_div" className="mb-2">
                  <label htmlFor="trek_category" className="form-label">Trek Category</label>
                  <select name="trek_category" id="trek_category" className="form-select"
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

              {/* Vendor Info */}
              {showVendorInfo && (
                <div id="vendor_info_div" className="mb-2">
                  <label className="form-label">Vendor Portal</label>
                  <p style={{ fontSize: '14px', color: '#555' }}>
                    For partnership and onboarding, please visit our vendor portal.
                  </p>
                  <a href="https://www.partner.aorbotreks.co.in" target="_blank" rel="noreferrer" className="contact-link">
                    www.partner.aorbotreks.co.in
                  </a>
                </div>
              )}

              {/* Message */}
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">Your Message</label>
                <textarea id="comment" name="comment" className="form-control" rows="3"
                  minLength="10" maxLength="500"
                  title="Message should be between 10 and 500 characters"
                  value={formData.comment} onChange={handleChange} required></textarea>
                <div className="invalid-feedback">Message must be between 10–500 characters.</div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary" id="submitBtn" disabled={submitting}>
                  <span id="btnText">{submitting ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6 d-flex align-items-center">
          <img src="/images/contact.webp" alt="Customer Support" className="contact-image" />
        </div>
      </div>

      <hr className="my-4" />

      <div className="row g-3 align-items-stretch">
        <div className="col-md-6 d-flex">
          <div className="border rounded card-custom w-100">
            <h4>Grievances</h4>
            <p>If you have any concerns or complaints about our services, please reach out to our dedicated
              grievance team.</p>
            <a href="mailto:Aorbotreks@gmail.com?subject=Issue Regarding the AorboTreks App"
              className="contact-link d-flex align-items-center">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'black' }}>✉️</span>Send a message
            </a>
          </div>
        </div>
        <div className="col-md-6 d-flex">
          <div className="border rounded card-custom w-100">
            <h4>Ombudsman</h4>
            <p>Reach out to our regulatory authority via message for complaint escalation.</p>
            <a href="#" className="contact-link">Know More</a>
          </div>
        </div>
      </div>

      {socialMedia.length > 0 && (
        <div className="mt-4">
          <h4>Connect With Us</h4>
          <div className="d-flex flex-wrap gap-3 mt-2">
            {socialMedia.map((social, i) => (
              <a key={i} href={social.url} className="btn btn-light rounded-circle p-2"
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

      <div className="row g-3 mt-2 align-items-stretch">
        <div className="col-md-6 d-flex">
          <div className="border rounded card-custom w-100">
            <h4>Registered Address</h4>
            <img src="/images/map_loc.webp" alt="Map Icon" className="img-fluid rounded mb-2"
              style={{ maxHeight: '150px' }} />
            {contactInfo ? (
              <>
                <address>
                  {contactInfo.company_name}<br />
                  {contactInfo.address_line1}<br />
                  {contactInfo.address_line2}<br />
                  {contactInfo.registration_number && <>CIN: {contactInfo.registration_number}</>}
                </address>
                {contactInfo.map_link && (
                  <a href={contactInfo.map_link} target="_blank" rel="noreferrer"
                    className="contact-link d-flex align-items-center">
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'black' }}>📍</span> View in Maps
                  </a>
                )}
              </>
            ) : (
              <>
                <address>
                  AORBO INFOCOM<br />
                  Sri Krup Market<br />
                  Malakpet, Hyderabad, India, 500036<br />
                </address>
                <a href="https://maps.app.goo.gl/ZgXJtZU7XJ9BXkaZ9" target="_blank" rel="noreferrer"
                  className="contact-link d-flex align-items-center">
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'black' }}>📍</span> View in Maps
                </a>
              </>
            )}
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="border rounded card-custom w-100">
            <h4>Customer Support</h4>
            {contactInfo ? (
              <>
                <p>{contactInfo.support_description}</p>
                {contactInfo.whatsapp_number && (
                  <a href={`https://wa.me/${contactInfo.whatsapp_number}`}>
                    <button className="chat-btn">Get Help <span className="arrow">→</span></button>
                  </a>
                )}
                <p className="support-text">To reach us by phone, tap below</p>
                {contactInfo.phone_number && (
                  <a href={`tel:+${contactInfo.phone_number}`} className="contact-link d-flex align-items-center">
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'black' }}>☎️</span> Contact Us
                  </a>
                )}
              </>
            ) : (
              <>
                <p>Tap on your Aorbo Treks app Help screen and select a topic for quick assistance.</p>
                <a href="https://wa.me/9398093503">
                  <button className="chat-btn">Get Help <span className="arrow">→</span></button>
                </a>
                <p className="support-text">To reach us by phone, tap below</p>
                <a href="tel:+919398093503" className="contact-link d-flex align-items-center">
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'black' }}>☎️</span> Contact Us
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lottie Animation Popup */}
      <div id="lottieAnimation" className="lottie-animation">
        <div id="lottieContainer"></div>
      </div>
    </main>
  );
}