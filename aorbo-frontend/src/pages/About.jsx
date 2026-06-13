import React from 'react';

export default function About() {
  // Self-contained inline layout parameters matching your platform branding
  const styles = {
    pageWrapper: {
      paddingTop: 'clamp(2rem, 5vw, 4rem)',
      paddingBottom: '5rem',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    container: {
      maxWidth: '1140px',
      margin: '0 auto',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem'
    },
    mainTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '1.5rem',
      borderBottom: '4px solid #facc15',
      display: 'inline-block',
      paddingBottom: '0.5rem'
    },
    sectionCard: {
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '2rem',
      border: '1px solid #e2e8f0'
    },
    subHeading: {
      fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    paragraph: {
      fontSize: '1.05rem',
      lineHeight: '1.75',
      color: '#475569',
      margin: 0
    },
    // Flex configuration helper for responsive rows
    splitRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2.5rem',
      alignItems: 'center'
    },
    splitColumn: {
      flex: '1 1 450px',
      minWidth: '300px'
    },
    featureList: {
      paddingLeft: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      margin: 0
    },
    featureItem: {
      fontSize: '1.05rem',
      lineHeight: '1.6',
      color: '#475569'
    },
    responsiveImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '12px',
      objectFit: 'cover',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <main style={styles.pageWrapper}>
      <div style={styles.container}>
        
        {/* HERO HEADER SECTION */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={styles.mainTitle}>About Us</h1>
          <div style={styles.splitRow}>
            <div style={styles.splitColumn}>
              <div style={styles.sectionCard}>
                <h2 style={styles.subHeading}>🥾 Who Are We?</h2>
                <p style={styles.paragraph}>
                  Aorbo Treks isn't just a business; it's a passion-driven venture born out of muddy boots,
                  endless trails, and an unshakable love for adventure. We recognized a pressing issue—
                  trekking enthusiasts struggling to find reliable organizers and secure options. So, we
                  decided to take matters into our own hands and create a platform that adventurers can trust.
                </p>
              </div>
            </div>
            <div style={{ ...styles.splitColumn, textAlign: 'center' }}>
              <img 
                src="/images/Group 1000001393.webp" 
                alt="About Team Adventure" 
                style={styles.responsiveImage} 
              />
            </div>
          </div>
        </div>

        {/* BACKSTORY SECTION */}
        <div style={styles.sectionCard}>
          <h2 style={styles.subHeading}>📜 Our Backstory</h2>
          <p style={styles.paragraph}>
            Our journey began with one simple idea: to make trekking easy, safe, and fun for everyone. No
            more endless searching, no more second-guessing, and no more falling prey to scams. We've been
            in your shoes—lost, confused, and disappointed—and we know how it feels. That's why we built
            Aorbo Treks, ensuring that no one else has to go through the same challenges. Our platform is
            designed to be your trusted guide, making every step of your journey worth remembering.
          </p>
        </div>

        {/* GOAL SECTION */}
        <div style={styles.sectionCard}>
          <h2 style={styles.subHeading}>🎯 Our Goal</h2>
          <p style={styles.paragraph}>
            Our vision is clear—to become your ultimate go-to platform for treks and adventure trips. We
            connect passionate adventurers like you with certified, experienced organizers, ensuring a
            seamless and worry-free experience. Think of us as the Tinder of trekking - only better! With
            Aorbo Treks, you won't have to worry about getting ghosted. Instead, you'll find the perfect
            match for your adventure needs.
          </p>
        </div>

        {/* MISSION SPLIT SECTION */}
        <div style={styles.sectionCard}>
          <div style={styles.splitRow}>
            <div style={styles.splitColumn}>
              <h2 style={styles.subHeading}>🚀 Our Mission</h2>
              <p style={styles.paragraph}>
                We are on a mission to spread the love of trekking and traveling to people from all walks
                of life. Whether you're an absolute beginner or a seasoned hiker, our goal is to make
                your trekking discoveries safe, unforgettable. We believe that trekking should be
                accessible to everyone, and we are here to make that happen.
              </p>
            </div>
            <div style={{ ...styles.splitColumn, textAlign: 'center', maxWidth: '380px', margin: '0 auto' }}>
              <img 
                src="/images/mission.webp" 
                alt="Our Mission Alignment" 
                style={styles.responsiveImage} 
              />
            </div>
          </div>
        </div>

        {/* DEDICATION SECTION */}
        <div style={styles.sectionCard}>
          <h2 style={styles.subHeading}>🤝 Our Dedication</h2>
          <p style={styles.paragraph}>
            At Aorbo Treks, trekking isn't just a job—it's our way of life. Our commitment goes beyond
            running a platform; we strive to build trust, ensure transparency, and craft experiences that
            leave you saying "That was the best decision ever!" Our team is composed of passionate trekkers
            who understand the ins and outs of adventure travel, always ready to go the extra mile to
            provide the best service.
          </p>
        </div>

        {/* AGENDA SECTION */}
        <div style={styles.sectionCard}>
          <h2 style={styles.subHeading}>📅 Our Agenda</h2>
          <p style={styles.paragraph}>
            Our goal is to transform trekking from a bucket-list activity into an integral part of your
            lifestyle. Because life's too short to stay indoors! We encourage you to step outside, connect
            with nature, meet like-minded adventurers, and create memories that last a lifetime. And while
            you focus on the thrill, we handle the logistics to ensure a hassle-free experience.
          </p>
        </div>

        {/* FEATURES GRID LIST */}
        <div style={styles.sectionCard}>
          <h2 style={styles.subHeading}>⭐ Why Choose Aorbo Treks?</h2>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <strong>Trusted Organizers:</strong> We partner with experienced and verified trekking experts to ensure your safety and satisfaction.
            </li>
            <li style={styles.featureItem}>
              <strong>Transparency:</strong> No hidden costs, no unpleasant surprises—just honest and straightforward service.
            </li>
            <li style={styles.featureItem}>
              <strong>Community:</strong> Join a thriving community of trekkers and adventurers who share your passion for the outdoors.
            </li>
            <li style={styles.featureItem}>
              <strong>Tailored Experiences:</strong> Whether you're looking for a solo trek or a group adventure, we have options to suit every need.
            </li>
          </ul>
        </div>

        {/* FOOTER ACTION BANNER */}
        <div style={{ ...styles.sectionCard, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff' }}>
          <div style={styles.splitRow}>
            <div style={styles.splitColumn}>
              <h2 style={{ ...styles.subHeading, color: '#ffffff' }}>🏔 Ready to Explore?</h2>
              <p style={{ ...styles.paragraph, color: '#94a3b8', marginBottom: '1.5rem' }}>
                Join us at Aorbo Treks and embark on a journey that's filled with excitement, adventure, and
                unforgettable experiences. Let's make trekking an adventure of a lifetime—one trail at a time!
              </p>
            </div>
            <div style={styles.splitColumn}>
              <img 
                src="/images/contact service.jpeg" 
                alt="Ready to Explore Trails" 
                style={styles.responsiveImage} 
              />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}