import React, { useState } from 'react';

export default function About() {
  // Local state hook managing mobile truncation toggles dynamically
  const [isExpanded, setIsExpanded] = useState({});

  const toggleSection = (id) => {
    setIsExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* ============ INJECTED INTERACTIVE STYLES ============ */}
      <style>{`
        /* Design System Variables */
        :root {
          --primary-gradient: linear-gradient(135deg, #facc15, #e2b100); /* 🎯 FIXED: Golden yellow core hover accent */
          --accent-gold: #facc15;
          --text-main: #1e293b;
          --text-muted: #475569;
          --bg-subtle: #f8fafc;
          --card-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
          --hover-shadow: 0 20px 40px rgba(250, 204, 21, 0.15); /* 🎯 FIXED: Golden tinted reflection glow on hover */
          --transition-smooth: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Global Configuration */
        html {
          scroll-behavior: smooth;
        }

        .about-container {
          max-width: 1440px;
          margin: clamp(2rem, 5vw, 3rem) auto 0;
          padding: clamp(1rem, 3vw, 1.5rem) clamp(1rem, 4vw, 5%);
          background: linear-gradient(180deg, #f8fafc 0%, #fffdf2 100%); /* Warm subtle gradient base */
          position: relative;
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Globally Corrected Layout Title Accentuation */
        .section-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #1e293b, #475569);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-flex;
          flex-direction: column;
          position: relative;
        }

        .section-title::after {
          content: '';
          width: 60px;
          height: 5px;
          background: var(--accent-gold);
          margin-top: 12px;
          border-radius: 10px;
          transition: var(--transition-smooth);
        }

        /* Hovering the container scales the title accent bar */
        .about-container:hover .section-title::after {
          width: 120px;
        }

        /* Premium Content Cards with Fluid Depth Mechanics */
        .content-section {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: var(--card-shadow);
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          overflow: hidden;
          transition: var(--transition-smooth);
        }

        /* Subtle top line accent illumination on card hover */
        .content-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--primary-gradient);
          opacity: 0;
          transition: var(--transition-smooth);
        }

        /* 🎯 FIXED: Golden hover transitions for content blocks */
        .content-section:hover {
          transform: translateY(-8px);
          box-shadow: var(--hover-shadow);
          border-color: rgba(250, 204, 21, 0.4); 
        }

        .content-section:hover::before {
          opacity: 1;
        }

        .content-section h2 {
          font-size: 1.7rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 1rem;
          margin-top: 0;
          transition: color 0.3s ease;
        }

        /* 🎯 FIXED: Sub-headers flash golden yellow on card cursor point */
        .content-section:hover h2 {
          color: #e2b100;
        }

        .content-section p {
          color: var(--text-muted);
          line-height: 1.9;
          font-size: 1.05rem;
          margin: 0;
        }

        /* Glassmorphism Feature List Item Clusters */
        .feature-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-list li {
          background: rgba(248, 250, 252, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(226, 232, 240, 0.5);
          border-left: 5px solid #2563eb;
          padding: 1.25rem;
          border-radius: 4px 16px 16px 4px;
          color: var(--text-muted);
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          transition: var(--transition-smooth);
        }

        /* 🎯 FIXED: Bullet layout tracks gold highlight response on hover */
        .feature-list li:hover {
          background: #fffdf2;
          transform: translateX(12px);
          border-color: rgba(250, 204, 21, 0.3);
          border-left-color: var(--accent-gold);
          box-shadow: 0 5px 15px rgba(250, 204, 21, 0.08);
        }

        .feature-list li::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #2563eb;
          border-radius: 50%;
          margin-right: 1rem;
          flex-shrink: 0;
          transition: var(--transition-smooth);
        }

        .feature-list li:hover::before {
          transform: scale(1.5);
          background-color: var(--accent-gold);
        }

        /* Immersive Hero Call-To-Action (CTA) Container */
        .ready-explore {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          background-size: 200% 200%;
          padding: 3.5rem 2rem;
          border-radius: 24px;
          text-align: center;
          color: #ffffff;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
          margin-top: 3rem;
        }

        .ready-explore::before {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(250,204,21,0.12) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          top: -120px;
          right: -120px;
          transition: transform 0.6s ease-out;
        }

        .ready-explore:hover::before {
          transform: scale(1.2) translate(-20px, 20px);
        }

        .ready-explore h2 {
          color: #ffffff;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          margin-top: 0;
        }

        .ready-explore p {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 1.5rem;
          line-height: 1.7;
        }

        /* Layout Columns Base Structures */
        .about-content {
          display: flex;
          gap: 3rem;
          margin-bottom: 2rem;
          align-items: center; /* Vertically aligns text with images nicely */
        }

        .about-left { flex: 2; }
        .about-right { flex: 1; display: flex; justify-content: center; }
        .image-stack { position: relative; width: 100%; max-width: 400px; }

        /* 🎯 FIXED: Universal Image Layer Size Adjuster - Locks bounding footprints */
        .img-fluid,
        .mission-image,
        .bottom-image-ready {
          width: 100%;
          height: 280px; /* Forces uniform height alignment bounds */
          border-radius: 20px;
          box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
          object-fit: cover; /* Crops image smoothly to fill frame without distortion */
        }

        .img-fluid:hover,
        .mission-image:hover,
        .bottom-image-ready:hover {
          transform: scale(1.04) translateY(-5px);
          box-shadow: 0 25px 45px rgba(250, 204, 21, 0.2);
        }

        /* Entry Animations */
        .content-section, .ready-explore {
          animation: elegantFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes elegantFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ==========================================================================
           📱 RESPONSIVE BREAKPOINT SYSTEM CONTROLS
           ========================================================================== */
        @media (max-width: 768px) {
          .about-content {
            flex-direction: column;
            gap: 2rem;
          }

          .section-title {
            font-size: 2.2rem;
          }
          
          .section-title::after {
            width: 50px;
          }
          
          .about-container:hover .section-title::after {
            width: 80px;
          }

          .content-section {
            padding: 2rem 1.5rem;
          }

          /* Reset absolute mobile shifts */
          .img-fluid, .mission-image, .bottom-image-ready {
            max-width: 100%;
            height: 220px; /* Slightly lower crop profile for phone grids */
          }

          .content-section p.truncated {
            max-height: 85px;
            overflow: hidden;
            position: relative;
          }

          .content-section p.truncated::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3.5rem;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
          }

          .view-toggle-btn {
            display: inline-block;
            font-size: 0.95rem;
            font-weight: 600;
            color: #e2b100;
            margin-top: 0.75rem;
            cursor: pointer;
            transition: color 0.2s;
          }
          
          .view-toggle-btn:hover {
            color: #1e293b;
          }

          .about-image {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .view-toggle-btn {
            display: none;
          }
        }
      `}</style>

      {/* ============ CORE JSX RENDERING COUPLING ============ */}
      <main className="about-container">
        
        {/* HERO HEADER SECTION */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h1 className="section-title">About Us</h1>
          <div className="about-content">
            <div className="about-left">
              <div className="content-section">
                <h2>🥾 Who Are We?</h2>
                <p className={!isExpanded['who'] ? 'truncated' : ''}>
                  Aorbo Treks isn't just a business; it's a passion-driven venture born out of muddy boots,
                  endless trails, and an unshakable love for adventure. We recognized a pressing issue—
                  trekking enthusiasts struggling to find reliable organizers and secure options. So, we
                  decided to take matters into our own hands and create a platform that adventurers can trust.
                </p>
                <span className="view-toggle-btn" onClick={() => toggleSection('who')}>
                  {isExpanded['who'] ? 'Read Less ▲' : 'Read More ▼'}
                </span>
              </div>
            </div>
            <div className="about-right about-image">
              <div className="image-stack">
                <img 
                  src="/images/Group 1000001393.webp" 
                  alt="About Team Adventure" 
                  className="img-fluid" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* BACKSTORY CARD */}
        <div className="content-section">
          <h2>📜 Our Backstory</h2>
          <p className={!isExpanded['backstory'] ? 'truncated' : ''}>
            Our journey began with one simple idea: to make trekking easy, safe, and fun for everyone. No
            more endless searching, no more second-guessing, and no more falling prey to scams. We've been
            in your shoes—lost, confused, and disappointed—and we know how it feels. That's why we built
            Aorbo Treks, ensuring that no one else has to go through the same challenges. Our platform is
            designed to be your trusted guide, making every step of your journey worth remembering.
          </p>
          <span className="view-toggle-btn" onClick={() => toggleSection('backstory')}>
            {isExpanded['backstory'] ? 'Read Less ▲' : 'Read More ▼'}
          </span>
        </div>

        {/* GOAL CARD */}
        <div className="content-section">
          <h2>🎯 Our Goal</h2>
          <p className={!isExpanded['goal'] ? 'truncated' : ''}>
            Our vision is clear—to become your ultimate go-to platform for treks and adventure trips. We
            connect passionate adventurers like you with certified, experienced organizers, ensuring a
            seamless and worry-free experience. Think of us as the Tinder of trekking - only better! With
            Aorbo Treks, you won't have to worry about getting ghosted. Instead, you'll find the perfect
            match for your adventure needs.
          </p>
          <span className="view-toggle-btn" onClick={() => toggleSection('goal')}>
            {isExpanded['goal'] ? 'Read Less ▲' : 'Read More ▼'}
          </span>
        </div>

        {/* MISSION SPLIT SECTION */}
        <div className="content-section">
          <div className="about-content" style={{ marginBottom: 0, gap: '2rem' }}>
            <div className="about-left">
              <h2>🚀 Our Mission</h2>
              <p className={!isExpanded['mission'] ? 'truncated' : ''}>
                We are on a mission to spread the love of trekking and traveling to people from all walks
                of life. Whether you're an absolute beginner or a seasoned hiker, our goal is to make
                your trekking discoveries safe, unforgettable. We believe that trekking should be
                accessible to everyone, and we are here to make that happen.
              </p>
              <span className="view-toggle-btn" onClick={() => toggleSection('mission')}>
                {isExpanded['mission'] ? 'Read Less ▲' : 'Read More ▼'}
              </span>
            </div>
            <div className="about-right about-image">
              <img 
                src="/images/mission.webp" 
                alt="Our Mission Alignment" 
                className="mission-image" 
              />
            </div>
          </div>
        </div>

        {/* DEDICATION CARD */}
        <div className="content-section">
          <h2>🤝 Our Dedication</h2>
          <p className={!isExpanded['dedication'] ? 'truncated' : ''}>
            At Aorbo Treks, trekking isn't just a job—it's our way of life. Our commitment goes beyond
            running a platform; we strive to build trust, ensure transparency, and craft experiences that
            leave you saying "That was the best decision ever!" Our team is composed of passionate trekkers
            who understand the ins and outs of adventure travel, always ready to go the extra mile to
            provide the best service.
          </p>
          <span className="view-toggle-btn" onClick={() => toggleSection('dedication')}>
            {isExpanded['dedication'] ? 'Read Less ▲' : 'Read More ▼'}
          </span>
        </div>

        {/* AGENDA CARD */}
        <div className="content-section">
          <h2>📅 Our Agenda</h2>
          <p className={!isExpanded['agenda'] ? 'truncated' : ''}>
            Our goal is to transform trekking from a bucket-list activity into an integral part of your
            lifestyle. Because life's too short to stay indoors! We encourage you to step outside, connect
            with nature, meet like-minded adventurers, and create memories that last a lifetime. And while
            you focus on the thrill, we handle the logistics to ensure a hassle-free experience.
          </p>
          <span className="view-toggle-btn" onClick={() => toggleSection('agenda')}>
            {isExpanded['agenda'] ? 'Read Less ▲' : 'Read More ▼'}
          </span>
        </div>

        {/* WHY CHOOSE LIST */}
        <div className="content-section">
          <h2>⭐ Why Choose Aorbo Treks?</h2>
          <ul className="feature-list">
            <li>
              <span><strong>Trusted Organizers:</strong> We partner with experienced and verified trekking experts to ensure your safety and satisfaction.</span>
            </li>
            <li>
              <span><strong>Transparency:</strong> No hidden costs, no unpleasant surprises—just honest and straightforward service.</span>
            </li>
            <li>
              <span><strong>Community:</strong> Join a thriving community of trekkers and adventurers who share your passion for the outdoors.</span>
            </li>
            <li>
              <span><strong>Tailored Experiences:</strong> Whether you're looking for a solo trek or a group adventure, we have options to suit every need.</span>
            </li>
          </ul>
        </div>

        {/* FOOTER ACTION BANNER */}
        <div className="ready-explore">
          <div className="about-content" style={{ marginBottom: 0, alignItems: 'center', gap: '2rem' }}>
            <div className="about-left" style={{ textAlign: 'left' }}>
              <h2>Ready to Explore?</h2>
              <p style={{ margin: 0 }}>
                Join us at Aorbo Treks and embark on a journey that's filled with excitement, adventure, and
                unforgettable experiences. Let's make trekking an adventure of a lifetime—one trail at a time!
              </p>
            </div>
            <div className="about-right about-image">
              <img 
                src="/images/contact service.jpeg" 
                alt="Ready to Explore Trails" 
                className="bottom-image-ready" 
              />
            </div>
          </div>
        </div>

      </main>
    </>
  );
}