import React from 'react';
import '../styles/Safety.css'; // Make sure to paste the CSS block below into this file

export default function Safety() {
  return (
    <main className="safety-page">
      <div className="safety-container-fluid">
        
        <h1>Safety</h1>

        {/* HERO */}
        <section className="safety-hero full-width">
          <div className="safety-image">
            <img src="/images/safe_1.webp" alt="Safe Trekking Experience" />
          </div>
          <div className="safety-content">
            <h2>Explore the Wild with Confidence</h2>
            <p>
              At Aorbo Treks, the safety of our users is our top priority. We ensure a secure and structured
              trekking experience by partnering with Verified Organizers - you are in safe hands!
            </p>
          </div>
        </section>

        {/* SAFETY FEATURES */}
        <section>
          <h2 className="section-title">Safety Features</h2>
          <div className="scrollable-row">
            <div className="feature-item">
              <h3>Female-Friendly Treks</h3>
              <p className="card-text-full">
                Offering women-specific treks with experienced female guides who bring a supportive and inclusive atmosphere.
              </p>
            </div>
            <div className="feature-item">
              <h3>24/7 Support</h3>
              <p className="card-text-full">
                We have a dedicated team that is available around the clock to assist with any emergencies or help you need.
              </p>
            </div>
            <div className="feature-item">
              <h3>Emergency Preparedness</h3>
              <p className="card-text-full">
                All treks are equipped with an emergency kit, have clear protocols in place, and medical support if needed.
              </p>
            </div>
            <div className="feature-item">
              <h3>Safety Drills</h3>
              <p className="card-text-full">
                Our trek guides are skilled in handling all types of situations and conduct regular training drills for all trek team members.
              </p>
            </div>
          </div>
        </section>

        {/* INDIVIDUAL TREKKER */}
        <section>
          <h2 className="section-title">Individual Trekker..?</h2>
          <div className="safety-card-image">
            <img src="/images/Group 1000001380.webp" alt="Individual Trekker Info" />
          </div>
          <div className="scrollable-row">
            <div className="safety-item">
              <h3>Solo Experience</h3>
              <p className="card-text-full">An individual trekker often plans their trek independently, relying on their own research to find treks and organizers.</p>
            </div>
            <div className="safety-item">
              <h3>Limited Access</h3>
              <p className="card-text-full">They may not have access to a wide variety of trekking options or specialized services without extensive research.</p>
            </div>
            <div className="safety-item">
              <h3>Greater Uncertainty</h3>
              <p className="card-text-full">Solo trekkers may feel uncertain about the reliability of organizers and safety, as they're usually working with unverified sources.</p>
            </div>
            <div className="safety-item">
              <h3>Higher Costs</h3>
              <p className="card-text-full">Solo trekkers might face higher costs since they aren't benefiting from group discounts or tailored packages that offer better value.</p>
            </div>
          </div>
        </section>

        {/* PLATFORM */}
        <section>
          <h2 className="section-title">On Aorbo Treks Platform</h2>
          <div className="platform-image">
            <img src="/images/Group 1000001376.webp" alt="Platform Comparison Info" />
          </div>
          <div className="scrollable-row">
            <div className="platform-item"><h3>Access to Multiple Organizers</h3><p class="card-text-full">Users can browse trusted trekking organizers on Aorbo, making it easy to compare options.</p></div>
            <div className="platform-item"><h3>Tailored Trek Options</h3><p class="card-text-full">Users can filter treks by preferences, ensuring a personalized experience.</p></div>
            <div className="platform-item"><h3>Safety and Assurance</h3><p class="card-text-full">Aorbo ensures partner organizers follow safety standards, providing reliable services for peace of mind.</p></div>
            <div className="platform-item"><h3>Cost-Effective Packages</h3><p class="card-text-full">Aorbo offers group discounts, special deals, and customizable packages to help users save.</p></div>
            <div className="platform-item"><h3>24/7 Support</h3><p class="card-text-full">Users have direct access to customer support, ensuring a secure and stress-free experience.</p></div>
            <div className="platform-item"><h3>Streamlined Booking Process</h3><p class="card-text-full">With Aorbo, users can easily book, pay, and manage their trips in one place.</p></div>
          </div>
        </section>

        {/* GROUP */}
        <section>
          <h2 className="section-title">At Aorbo Treks, we make group bookings easy, affordable, and hassle-free</h2>
          <div className="group-image">
            <img src="/images/money2.webp" alt="Group Discount Benefit" />
          </div>
          <div className="scrollable-row">
            <div className="group-item"><h3>Simple Booking</h3><p class="card-text-full">Group leaders can book for the entire group online with customizable trek options.</p></div>
            <div className="group-item"><h3>Exclusive Discounts</h3><p class="card-text-full">Get special pricing and flexible payment options for groups.</p></div>
            <div className="group-item"><h3>Dedicated Support</h3><p class="card-text-full">Enjoy personalized assistance and 24/7 customer support for a smooth experience.</p></div>
            <div className="group-item"><h3>Safety & Logistics</h3><p class="card-text-full">We manage safety, transport, and accommodation for your group's comfort.</p></div>
            <div className="group-item"><h3>Team Building</h3><p class="card-text-full">Engage in activities that promote bonding and collaboration.</p></div>
            <div className="group-item"><h3>Seamless Communication</h3><p class="card-text-full">Keep everyone informed with clear details and updates.</p></div>
          </div>
        </section>

      </div>
    </main>
  );
}