import React, { useState, useEffect } from 'react';
import '../styles/Contact.css'; // Links directly to your external styles sheet

// Validation helpers
// Exact email format: local-part@domain.tld
// - no leading/trailing/consecutive dots in local part
// - domain must have at least one dot, valid label chars, TLD of 2+ letters
const EMAIL_REGEX = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

// Indian mobile: exactly 10 digits, first digit must be 6, 7, 8, or 9
const INDIAN_MOBILE_REGEX = /^[6789][0-9]{9}$/;

// Whitelist of real top-level domains. A regex like [a-zA-Z]{2,} alone would
// wrongly accept junk like "gmail.cokhvbjhjgh" since it's just letters.
const SIMPLE_TLDS = new Set([
  'com', 'net', 'org', 'edu', 'gov', 'mil', 'int', 'info', 'biz', 'name',
  'in', 'co', 'io', 'me', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn',
  'ru', 'br', 'za', 'nl', 'es', 'it', 'ch', 'se', 'no', 'nz', 'sg', 'ae',
  'app', 'dev', 'xyz', 'online', 'store', 'tech', 'ai', 'shop', 'site',
]);
const COMPOUND_TLDS = new Set([
  'co.in', 'org.in', 'net.in', 'gov.in', 'ac.in', 'edu.in', 'nic.in', 'res.in',
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk',
  'com.au', 'net.au', 'org.au', 'co.nz',
]);

const hasValidTld = (domain) => {
  const labels = domain.toLowerCase().split('.');
  if (labels.length < 2) return false;
  const lastTwo = labels.slice(-2).join('.');
  if (COMPOUND_TLDS.has(lastTwo)) return true;
  const lastOne = labels[labels.length - 1];
  return SIMPLE_TLDS.has(lastOne);
};

// Catches common typos of popular email domains (e.g. gmail.co -> gmail.com)
const DOMAIN_TYPO_FIXES = {
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gamil.com': 'gmail.com',
  'yahoo.co': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'hotmail.co': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'outlook.co': 'outlook.com',
  'outlok.com': 'outlook.com',
  'rediffmail.co': 'rediffmail.com',
  'icloud.co': 'icloud.com',
};

const getDomainTypoFix = (email) => {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return null;
  return DOMAIN_TYPO_FIXES[domain] || null;
};

const validateField = (name, value) => {
  switch (name) {
    case 'email': {
      if (!value) return 'Please fill this field. Example: yourname@gmail.com';
      if (!EMAIL_REGEX.test(value)) return 'That email looks incorrect. Please enter it like: yourname@gmail.com';
      const domain = value.split('@')[1] || '';
      if (!hasValidTld(domain)) return 'That domain ending doesn\'t look real. Please enter it like: yourname@gmail.com';
      const typoFix = getDomainTypoFix(value);
      if (typoFix) return `Looks like a typo. Did you mean "${value.split('@')[0]}@${typoFix}"?`;
      return '';
    }
    case 'mobile':
      if (!value) return 'Please fill this field. Example: 9876543210';
      if (value.length < 10) return `Enter all 10 digits. Example: 9876543210 (${value.length}/10 entered)`;
      if (!INDIAN_MOBILE_REGEX.test(value)) return 'Number must start with 6, 7, 8, or 9. Example: 9876543210';
      return '';
    case 'name':
      if (!value) return 'Please fill this field. Example: Ravi Kumar';
      if (!/^[A-Za-z\s]{2,50}$/.test(value)) return 'Use letters only, 2–50 characters. Example: Ravi Kumar';
      return '';
    case 'comment':
      if (!value) return 'Please fill this field with your message (at least 10 characters).';
      if (value.length < 10) return `Message too short. Add ${10 - value.length} more character(s).`;
      if (value.length > 500) return 'Message is too long. Please keep it under 500 characters.';
      return '';
    default:
      return '';
  }
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    user_type: '',
    trek_category: '',
    comment: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [contactInfo, setContactInfo] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [showTrekCategory, setShowTrekCategory] = useState(false);
  const [showVendorInfo, setShowVendorInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

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
    const { name, value } = e.target;

    // Mobile: strip non-digits and cap at 10 chars as the user types
    const cleanedValue = name === 'mobile' ? value.replace(/[^0-9]/g, '').slice(0, 10) : value;

    setFormData(prev => ({ ...prev, [name]: cleanedValue }));

    // Live-validate once the field has been touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, cleanedValue) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const fieldClass = (name) =>
    `form-control-custom${touched[name] && errors[name] ? ' is-invalid' : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate every required field before submitting
    const fieldsToValidate = ['name', 'email', 'mobile', 'comment'];
    const newErrors = {};
    fieldsToValidate.forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });
    if (!formData.user_type) newErrors.user_type = 'Please select an option from the list.';

    setErrors(newErrors);
    setTouched({ name: true, email: true, mobile: true, comment: true, user_type: true });

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      const missingCount = Object.values(newErrors).filter(Boolean).length;
      setToast({
        type: 'error',
        msg: missingCount > 1
          ? `❌ Please fill all fields correctly (${missingCount} fields need attention).`
          : '❌ Please correct the highlighted field before submitting.',
      });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        setToast({ type: 'success', msg: "✅ Message sent! We'll get back to you soon." });
        setFormData({ name: '', email: '', mobile: '', user_type: '', trek_category: '', comment: '' });
        setErrors({});
        setTouched({});
        setShowTrekCategory(false);
        setShowVendorInfo(false);
      } else {
        setToast({ type: 'error', msg: `❌ ${result.message || 'Something went wrong.'}` });
      }
    } catch {
      setToast({ type: 'error', msg: '❌ Network error. Please try again.' });
    }
    setSubmitting(false);
    setTimeout(() => setToast(null), 4000);
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
                <input type="text" className={fieldClass('name')} id="name" name="name"
                  value={formData.name} onChange={handleChange} onBlur={handleBlur} required />
                {touched.name && errors.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
              </div>

              {/* Email Input Block */}
              <div className="input-group-custom mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className={fieldClass('email')} id="email" name="email"
                  placeholder="name@example.com"
                  value={formData.email} onChange={handleChange} onBlur={handleBlur} required />
                {touched.email && errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>

              {/* Mobile Input Block */}
              <div className="input-group-custom mb-3">
                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                <input type="tel" className={fieldClass('mobile')} id="mobile" name="mobile"
                  maxLength="10" inputMode="numeric" placeholder="9876543210"
                  value={formData.mobile} onChange={handleChange} onBlur={handleBlur} required />
                {touched.mobile && errors.mobile && (
                  <div className="invalid-feedback d-block">{errors.mobile}</div>
                )}
              </div>

              {/* User Type Selection Dropdown */}
              <div className="input-group-custom mb-3">
                <label htmlFor="user_type" className="form-label">I am a</label>
                <select id="user_type" name="user_type" className="form-select-custom"
                  onChange={handleUserType} onBlur={handleBlur} value={formData.user_type} required>
                  <option value="">-- Select --</option>
                  <option value="trekker">Trekker</option>
                  <option value="organizer">Trek Organizer</option>
                  <option value="other">Other</option>
                </select>
                {touched.user_type && errors.user_type && (
                  <div className="invalid-feedback d-block">{errors.user_type}</div>
                )}
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
                <textarea id="comment" name="comment" className={fieldClass('comment')} rows="3"
                  maxLength="500"
                  value={formData.comment} onChange={handleChange} onBlur={handleBlur} required></textarea>
                {touched.comment && errors.comment && (
                  <div className="invalid-feedback d-block">{errors.comment}</div>
                )}
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

      {/* Toast Notification */}
      {toast && (
        <div className={`contact-toast contact-toast--${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </main>
  );
}