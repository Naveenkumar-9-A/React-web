import React, { useState } from 'react';

export default function TrekDetail() {
  // State for your dynamic Django API safety tips loop
  const [safetyTips, setSafetyTips] = useState([]);

  // Self-contained styles to combine structural layouts and remove external files
  const styles = {
    pageWrapper: {
      paddingTop: '3rem',
      paddingBottom: '3rem',
      backgroundColor: '#f9fafb',
      color: '#1f2937',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    container: {
      maxWidth: '1140px',
      margin: '0 auto',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    },
    mainTitle: {
      fontSize: 'clamp(2.1rem, 5vw, 2.5rem)',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '3rem'
    },
    sectionHeading: {
      fontSize: 'clamp(1.6rem, 4vw, 2rem)',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    // Flex-based row setup to perfectly mimic Bootstrap's "row align-items-center"
    rowFlex: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2rem',
      alignItems: 'center',
      marginBottom: '4rem'
    },
    colHalf: {
      flex: '1 1 450px',
      minWidth: '300px'
    },
    // Fluid responsive grid structure for the top 4 columns
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.5rem',
      marginBottom: '4rem'
    },
    // Vertical column stacking layout
    verticalStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    // Individual element configurations
    featureCard: {
      padding: '1.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    cardHeading: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#0d6efd',
      marginBottom: '0.5rem'
    },
    itemHeading: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.4rem'
    },
    paragraph: {
      fontSize: '1rem',
      lineHeight: '1.6',
      color: '#6b7280',
      margin: 0
    },
    responsiveImg: {
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
      objectFit: 'cover'
    },
    iconCenter: {
      textAlign: 'center',
      marginTop: '1rem'
    },
    tipIcon: {
      maxWidth: '48px',
      height: 'auto'
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h1 style={styles.mainTitle}>Safety</h1>

        {/* HERO SECTION */}
        <section style={styles.rowFlex}>
          <div style={styles.colHalf}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '600' }}>Explore the Wild with Confidence</h2>
            <p style={styles.paragraph}>
              At Aorbo Treks, the safety of our users is our top priority. We ensure a secure and structured
              trekking experience by partnering with Verified Organizers - you are in safe hands!
            </p>
          </div>
          <div style={styles.colHalf}>
            <img 
              src="/images/Aorbo safety.webp" 
              alt="Safe Trekking Experience" 
              style={styles.responsiveImg} 
            />
          </div>
        </section>

        {/* SAFETY FEATURES SECTION (DYNAMIC API TARGET + COPIED FALLBACKS) */}
        <section style={styles.featuresGrid}>
          {safetyTips.length > 0 ? (
            safetyTips.map((tip, index) => (
              <div key={index} style={styles.featureCard}>
                <div>
                  <h3 style={styles.cardHeading}>{tip.title}</h3>
                  <p style={styles.paragraph}>{tip.description}</p>
                </div>
                {tip.icon && (
                  <div style={styles.iconCenter}>
                    <img src={tip.icon.url} alt={tip.title} style={styles.tipIcon} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <div style={styles.featureCard}>
                <h3 style={styles.cardHeading}>Female-Friendly Treks</h3>
                <p style={styles.paragraph}>Offering women-specific treks with experienced female guides who bring a supportive and inclusive atmosphere.</p>
              </div>
              <div style={styles.featureCard}>
                <h3 style={styles.cardHeading}>24/7 Support</h3>
                <p style={styles.paragraph}>We have a dedicated team that is available around the clock to assist with any emergencies or help you need.</p>
              </div>
              <div style={styles.featureCard}>
                <h3 style={styles.cardHeading}>Emergency Preparedness</h3>
                <p style={styles.paragraph}>All treks are equipped with an emergency kit, have clear protocols in place, and medical support if needed.</p>
              </div>
              <div style={styles.featureCard}>
                <h3 style={styles.cardHeading}>Safety Drills</h3>
                <p style={styles.paragraph}>Our trek guides are skilled in handling all types of situations and conduct regular training drills for all trek team members.</p>
              </div>
            </>
          )}
        </section>

        {/* INDIVIDUAL TREKKER SECTION */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={styles.sectionHeading}>Individual Trekker..?</h2>
          <div style={styles.rowFlex}>
            <div style={styles.colHalf}>
              <img 
                src="/images/Assurance.webp" 
                alt="Individual Safety" 
                style={styles.responsiveImg} 
              />
            </div>
            <div style={{ ...styles.colHalf, ...styles.verticalStack }}>
              <div>
                <h3 style={styles.itemHeading}>Solo Experience</h3>
                <p style={styles.paragraph}>An individual trekker often plans their trek independently, relying on their own research to find treks and organizers.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Limited Access</h3>
                <p style={styles.paragraph}>They may not have access to a wide variety of trekking options or specialized services without extensive research.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Greater Uncertainty</h3>
                <p style={styles.paragraph}>Solo trekkers may feel uncertain about the reliability of organizers and safety, as they're usually working with unverified sources.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Higher Costs</h3>
                <p style={styles.paragraph}>Solo trekkers might face higher costs since they aren't benefiting from group discounts or tailored packages that offer better value.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM SAFETY SECTION */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={styles.sectionHeading}>Our on Aorbo Treks Platform</h2>
          <div style={styles.rowFlex}>
            <div style={{ ...styles.colHalf, ...styles.verticalStack }}>
              <div>
                <h3 style={styles.itemHeading}>Access to Multiple Organizers</h3>
                <p style={styles.paragraph}>Users can browse trusted trekking organizers on Aorbo, making it easy to compare options.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Tailored Trek Options</h3>
                <p style={styles.paragraph}>Users can filter treks by preferences, ensuring a personalized experience.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Safety and Assurance</h3>
                <p style={styles.paragraph}>Aorbo ensures partner organizers follow safety standards, providing reliable services for peace of mind.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Cost-Effective Packages</h3>
                <p style={styles.paragraph}>Aorbo offers group discounts, special deals, and customizable packages to help users save.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>24/7 Support</h3>
                <p style={styles.paragraph}>Users have direct access to customer support, ensuring a secure and stress-free experience.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Streamlined Booking Process</h3>
                <p style={styles.paragraph}>With Aorbo, users can easily book, pay, and manage their trips in one place.</p>
              </div>
            </div>
            <div style={styles.colHalf}>
              <img 
                src="/images/Aorbo connects you with certified trekking partners, taking care of safety, serving evoking unforgettable experiences. Book your next trek safely with Aorbo, where safety meets excitement..webp" 
                alt="Platform Safety" 
                style={styles.responsiveImg} 
              />
            </div>
          </div>
        </section>

        {/* GROUP SAFETY SECTION */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={styles.sectionHeading}>At Aorbo Treks, we make group bookings easy, affordable, and hassle-free</h2>
          <div style={styles.rowFlex}>
            <div style={styles.colHalf}>
              <img 
                src="/images/money 1.webp" 
                alt="Safe Group Payments" 
                style={styles.responsiveImg} 
              />
            </div>
            <div style={{ ...styles.colHalf, ...styles.verticalStack }}>
              <div>
                <h3 style={styles.itemHeading}>Simple Booking</h3>
                <p style={styles.paragraph}>Group leaders can book for the entire group online with customizable trek options.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Exclusive Discounts</h3>
                <p style={styles.paragraph}>Get special pricing and flexible payment options for groups.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Dedicated Support</h3>
                <p style={styles.paragraph}>Enjoy personalized assistance and 24/7 customer support for a smooth experience.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Safety & Logistics</h3>
                <p style={styles.paragraph}>We manage safety, transport, and accommodation for your group's comfort.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Team Building</h3>
                <p style={styles.paragraph}>Engage in activities that promote bonding and collaboration.</p>
              </div>
              <div>
                <h3 style={styles.itemHeading}>Seamless Communication</h3>
                <p style={styles.paragraph}>Keep everyone informed with clear details and updates.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}