import DOMPurify from 'dompurify';
import { useEffect, useState } from "react";

export default function UserAgreement() {

  const [contentSections, setContentSections] = useState([]);

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/content-sections/agreement/")
    .then((response) => response.json())
    .then((data) => setContentSections(data))
    .catch((error) =>
      console.error("Failed to load agreement content:", error)
    );
}, []);
  // Combined inline styles object to handle layout structural design without separate CSS
  const styles = {
    container: {
      maxWidth: '1000px',
      margin: 'clamp(1rem, 3vw, 1.5rem) auto 0',
      padding: 'clamp(2rem, 4vw, 4rem) clamp(1rem, 4vw, 2rem)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#ffffff',
      color: '#1f2937'
    },
    mainTitle: {
      fontSize: 'clamp(24px, 4vw, 36px)',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    heading3: {
      fontSize: 'clamp(16px, 2.5vw, 20px)',
      fontWeight: '600',
      marginTop: '2rem',
      marginBottom: '1rem',
      color: '#111827'
    },
    paragraph: {
      fontSize: 'clamp(12px, 1.2vw, 16px)',
      marginBottom: '10px',
      lineHeight: '1.6',
      textAlign: 'justify'
    },
    list: {
      paddingLeft: 'clamp(1rem, 2vw, 1.5rem)',
      marginBottom: '1rem'
    }
  };

  return (
    <section style={styles.container}>
      <h1 style={styles.mainTitle}>User Agreement</h1>
      
      <div className="user-agreement-content">
        
        {/* 1. DEFINITIONS AND INTERPRETATION */}
        <h3 style={styles.heading3}>1. DEFINITIONS AND INTERPRETATION</h3>
        <p style={styles.paragraph}>
          1.1 <strong>“Aorbo Treks”</strong> refers to the business entity operated by <strong>Aorbo Infocom</strong>,
          offering services related to trekking, travel bookings, and other related activities through its platform,
          including the Website and mobile applications.
        </p>
        <p style={styles.paragraph}>
          1.2 <strong>“User”</strong> refers to an individual who accesses, browses, or uses the Website, Application,
          platform, and services provided by Aorbo Treks.
        </p>
        <p style={styles.paragraph}>
          1.3 <strong>“Service Providers”</strong> refers to the third-party vendors, trekking organizers, travel
          agencies, or any other entity offering services through Aorbo Treks.
        </p>
        <p style={styles.paragraph}>
          1.4 <strong>“Website”</strong> refers to the official website, <strong style={{ color: '#0c67ee' }}>www.aorbotreks.com</strong>, 
          as well as any related mobile applications, platforms, and tools provided by Aorbo Treks.
        </p>
        <p style={styles.paragraph}>
          1.5 <strong>“Agreement”</strong> refers to this legally binding document, inclusive of any modifications,
          amendments, or updates made from time to time, which governs the terms, conditions, and policies applicable
          to the use of the Aorbo Treks website, platform, and all associated services offered by Aorbo Treks.
        </p>

        {/* 2. ACCEPTANCE OF TERMS */}
        <h3 style={styles.heading3}>2. ACCEPTANCE OF TERMS</h3>
        <p style={styles.paragraph}>
          2.1 By accessing or using the Website, mobile applications, or any related services provided by Aorbo Treks,
          the User agrees to be bound by this <strong>User Agreement</strong>. If the User does not agree with the
          terms and conditions herein, they must refrain from using the Website or services.
        </p>
        <p style={styles.paragraph}>
          2.2 Aorbo Treks reserves the right to modify or update the User Agreement at its discretion. Any changes made
          will be reflected on the Website, and continued use of the Website after such modifications will be deemed
          as acceptance of those changes.
        </p>

        {/* 3. ELIGIBILITY AND ACCOUNT REGISTRATION */}
        <h3 style={styles.heading3}>3. ELIGIBILITY AND ACCOUNT REGISTRATION</h3>
        <p style={styles.paragraph}>
          3.1 To use the services provided by Aorbo Treks, the User must be at least 18 years of age and have the legal
          capacity to enter into and comply with this Agreement. <strong>If the User is under the age of 18,</strong>{' '}
          they may not use the Website or services without supervision from a parent or legal guardian.
        </p>
        <p style={styles.paragraph}>
          3.2 The User agrees to provide accurate and truthful information during registration...
        </p>
        <p style={styles.paragraph}>
          3.3 In case of any unauthorized use or breach of security related to their account, the User must immediately
          notify Aorbo Treks and take steps to protect their account.
        </p>

        {/* 4. SERVICES AND USE OF THE WEBSITE */}
        <h3 style={styles.heading3}>4. SERVICES AND USE OF THE WEBSITE</h3>
        <p style={styles.paragraph}>
          4.1 <strong>Aorbo Treks</strong> offers a platform where Users can browse and book trekking and travel
          services provided by third-party Service Providers. Aorbo Treks is not a direct service provider, 
          <strong> but an intermediary that connects Users with these Service Providers</strong>.
        </p>
        <p style={styles.paragraph}>
          4.2 Users acknowledge that Aorbo Treks is not responsible for the quality, availability, or performance of
          the services provided by the Service Providers, and any issues or disputes must be resolved directly with
          the Service Providers.
        </p>
        <p style={styles.paragraph}>
          4.3 Users may book services such as treks, tours, and other travel-related products via the Website. By
          confirming a booking, the User agrees to the terms and conditions of the Service Provider.
        </p>
        <p style={styles.paragraph}>
          4.4 <strong>Aorbo Treks</strong> may charge service fees, booking fees, or other charges in addition to the
          price of the services provided by the Service Providers. These fees will be disclosed during the booking
          process.
        </p>
        <p style={styles.paragraph}>
          4.5 <strong>Aorbo Treks</strong> reserves the right to modify, suspend, or discontinue its Website or
          services at any time without prior notice.
        </p>

        {/* 5. USER RESPONSIBILITIES */}
        <h3 style={styles.heading3}>5. USER RESPONSIBILITIES</h3>
        <p style={styles.paragraph}>
          5.1 The User agrees to use the Website and its services only for lawful purposes and in compliance with all
          applicable laws, regulations, and guidelines.
        </p>
        <p style={styles.paragraph}>
          5.2 The User is responsible for reviewing the details of the services or products before making a booking. By
          making a booking, the User confirms that they have read and understood the terms and conditions of the
          Service Provider, as well as any additional terms associated with the booking.
        </p>
        <p style={styles.paragraph}>
          5.3 Users are prohibited from uploading, posting, transmitting, or distributing any content on the Website
          that is unlawful, offensive, defamatory, abusive, or otherwise harmful. Aorbo Treks reserves the right to
          remove such content at its discretion and take appropriate legal action against the responsible
          individual(s).
        </p>
        <p style={styles.paragraph}>
          5.4 The User agrees not to use the Website for the purpose of engaging in fraudulent or misleading
          activities, including making false claims, misrepresenting their identity, or engaging in any form of
          illegal activity.
        </p>

        {/* 6. PAYMENT TERMS AND FEES */}
        <h3 style={styles.heading3}>6. PAYMENT TERMS AND FEES</h3>
        <p style={styles.paragraph}>
          6.1 <strong>Booking Process:</strong>{' '}
          Users may search, select, and book trips through the Aorbo Treks platform based on availability and the
          terms set by individual Vendors. The booking process is subject to the specific terms and conditions of the
          Vendor offering the trek or service.
        </p>
        <p style={styles.paragraph}>
          6.2 <strong>Payment Modes:</strong>{' '}
          Aorbo Treks facilitates multiple payment options, which are subject to the arrangement with the Vendor.
          These payment options include:
        </p>
        <ul style={styles.list}>
          <li>
            <p style={styles.paragraph}><strong>Full Payment:</strong> The total trip amount is paid upfront via the platform at the time of booking.</p>
          </li>
          <li>
            <p style={styles.paragraph}><strong>Partial Payment:</strong> Users may pay a booking fee via the platform, with the remaining balance due directly to the Vendor according to the agreed booking terms.</p>
          </li>
          <li>
            <p style={styles.paragraph}><strong>Pay at Site:</strong> A portion of the payment is collected via the platform, and the remaining balance is settled in person—by cash or UPI—at the designated trek commencement point.</p>
          </li>
        </ul>
        <p style={styles.paragraph}>
          6.3 <strong>Additional Charges:</strong>{' '}
          The User acknowledges that they are solely responsible for any additional charges that are not included in
          the base booking price. These charges may include, but are not limited to, toll fees, permits, parking, gear
          rentals, porter fees, or applicable government levies. These additional costs shall be paid directly to the
          Vendor or authorized personnel and may be disclosed either during or after the booking process.
        </p>
        <p style={styles.paragraph}>
          6.4 <strong>Refund Responsibility Disclaimer:</strong>{' '}
          Aorbo Treks shall not be held liable for processing or determining the eligibility or quantum of refunds.
          All refund-related requests are governed solely by the respective Vendor’s cancellation and refund policy.
          The decision to approve, deny, or calculate the refund amount rests entirely with the Vendor. Aorbo Treks,
          however, will provide reasonable assistance in facilitating communication and coordination between the User
          and the Vendor.
        </p>
        <p style={styles.paragraph}>
          6.5 <strong>Payment Security:</strong>{' '}
          All transactions made through the platform are securely processed through third-party payment gateways.
          Aorbo Treks does not store any sensitive financial information, ensuring that User payment data is handled
          securely in accordance with industry standards.
        </p>
        <p style={styles.paragraph}>
          6.6 <strong>Service Charges:</strong>{' '}
          Aorbo Treks may impose a facilitation fee for processing bookings, which will be clearly disclosed to the
          User during the booking process. This fee is separate from the charges for services provided by the Vendor,
          and the User is solely responsible for selecting their preferred Vendor.
        </p>
        <p style={styles.paragraph}>
          6.7 <strong>Taxes:</strong>{' '}
          Users are responsible for the payment of all applicable taxes in accordance with local laws and regulations.
          Any tax liabilities arising from the User's bookings will be determined and payable by the User at the time
          of booking or during the course of the service.
        </p>

        {/* 7. CANCELLATIONS AND REFUNDS */}
        <h3 style={styles.heading3}>7. CANCELLATIONS AND REFUNDS</h3>
        <p style={styles.paragraph}>
          7.1 Users may cancel their bookings in accordance with the cancellation policies of the respective Service
          Providers. While Aorbo Treks will assist with the cancellation process, it cannot guarantee a full refund if
          the Service Provider’s cancellation policy does not allow for one, as the choice of Vendor is made by the User.
        </p>
        <p style={styles.paragraph}>
          7.2 <strong>Refunds</strong> for cancellations will be processed in accordance with the Service Provider's
          policies. Depending on the payment method, refunds may be issued to the original payment method and may take
          several business days to process, as the choice of Vendor is made by the User.
        </p>
        <p style={styles.paragraph}>
          7.3 <strong>Aorbo Treks</strong> shall not be held liable for any loss incurred due to cancellations or
          changes made by the Service Providers. Additionally, Aorbo Treks is not responsible for any inconvenience
          caused, as the choice of Vendor is solely the responsibility of the User.
        </p>

        {/* 8. PRIVACY AND CONFIDENTIALITY */}
        <h3 style={styles.heading3}>8. PRIVACY AND CONFIDENTIALITY</h3>
        <p style={styles.paragraph}>
          8.1 The User agrees to the <strong>Privacy Policy</strong> of Aorbo Treks, which governs how personal
          information is collected, used, stored, and protected. The Privacy Policy is incorporated into this
          Agreement by reference.
        </p>
        <p style={styles.paragraph}>
          8.2 Aorbo Treks will use reasonable efforts to protect the confidentiality and security of User data in
          accordance with industry standards. However, no data transmission over the internet can be completely
          secure, and Aorbo Treks cannot guarantee absolute security.
        </p>
        <p style={styles.paragraph}>
          8.3 The User acknowledges and agrees that Aorbo Treks may share their information with third-party Service
          Providers in order to facilitate bookings, provide customer support, or comply with legal obligations.
        </p>

        {/* 9. INTELLECTUAL PROPERTY RIGHTS */}
        <h3 style={styles.heading3}>9. INTELLECTUAL PROPERTY RIGHTS</h3>
        <p style={styles.paragraph}>
          9.1 The Website and all its content, including but not limited to logos, text, images, videos, and software,
          are owned by Aorbo Treks or its licensors and are protected by intellectual property laws.
        </p>
        <p style={styles.paragraph}>
          9.2 The User is granted a limited, non-exclusive, non-transferable license to access and use the Website for
          personal, non-commercial purposes. Any unauthorized use of the Website’s content is strictly prohibited.
        </p>
        <p style={styles.paragraph}>
          9.3 The User agrees not to modify, reproduce, distribute, or create derivative works of any content from the
          Website without express permission from Aorbo Treks.
        </p>

        {/* 10. LIMITATION OF LIABILITY */}
        <h3 style={styles.heading3}>10. LIMITATION OF LIABILITY</h3>
        <p style={styles.paragraph}>
          10.1 Aorbo Treks will not be liable for any direct, indirect, incidental, special, or consequential damages
          arising from the use or inability to use the Website, services, or products offered.
        </p>
        <p style={styles.paragraph}>
          10.2 Aorbo Treks does not warrant the accuracy, completeness, or reliability of any information or content
          provided on the Website. All content is provided on an "as-is" basis, and Aorbo Treks disclaims all
          warranties, express or implied, including but not limited to merchantability and fitness for a particular purpose.
        </p>
        <p style={styles.paragraph}>
          10.3 The User agrees that Aorbo Treks’s liability, if any, shall not exceed the total amount paid by the User
          for the service or product in question.
        </p>

        {/* 11. SEVERABILITY */}
        <h3 style={styles.heading3}>11. SEVERABILITY</h3>
        <p style={styles.paragraph}>
          11.1 If any provision of this Agreement is found to be invalid, illegal, or unenforceable by a court of
          competent jurisdiction, the validity of the remaining provisions shall not be affected, and the Agreement
          will be enforced to the maximum extent possible.
        </p>

        {/* 12. DISPUTE RESOLUTION AND GOVERNING LAW */}
        <h3 style={styles.heading3}>12. DISPUTE RESOLUTION AND GOVERNING LAW</h3>
        <p style={styles.paragraph}>
          12.1 This Agreement shall be governed by and construed in accordance with the laws of India.
        </p>
        <p style={styles.paragraph}>
          12.2 Any disputes arising out of or relating to this Agreement shall be resolved through arbitration, and the
          arbitration proceedings shall take place in Hyderabad, India. The decision of the arbitrator shall be final
          and binding.
        </p>
        <p style={styles.paragraph}>
          12.3 Notwithstanding the above, Aorbo Treks may seek injunctive or other equitable relief in any court of
          competent jurisdiction to protect its intellectual property or enforce its rights under this Agreement.
        </p>

        {/* 13. AMENDMENTS */}
        <h3 style={styles.heading3}>13. AMENDMENTS</h3>
        <p style={styles.paragraph}>
          13.1 Aorbo Treks reserves the right to modify, update, or amend this Agreement at any time. Any changes to
          the Agreement will be posted on the Website, and the User’s continued use of the Website constitutes
          acceptance of the modified terms.
        </p>

        {/* 14. CONTACT INFORMATION */}
        <h3 style={styles.heading3}>14. CONTACT INFORMATION</h3>
        <p style={{ ...styles.paragraph, fontWeight: '600' }}>
          Company: AORBO INFOCOM<br />
          Platform: Aorbo Treks (www.aorbotreks.com)<br />
          Support Email: support@aorbotreks.com<br />
          Phone: +91 9398093503<br />
          Registered Office: Aorbo Treks, Sri Krupa Market, Malakpet, Hyderabad, Telangana
        </p>

        <p style={styles.paragraph}>
          This User Agreement is a legally binding contract between Aorbo Treks and the User. By using our services,
          the User acknowledges that they have read, understood, and agreed to be bound by these terms and conditions.
        </p>
      </div>

      {/* Additional User Agreement Sections from Admin */}

{contentSections.length > 0 &&
  contentSections.map((section, index) => (
    <div
      key={section.id}
      style={{ marginBottom: "20px" }}
    >
      <h3 className="h4 fw-semibold">
        {14 + index + 1}. {section.heading}
      </h3>

      {section.sub_heading && (
        <h5 className="fw-semibold">
          {section.sub_heading}
        </h5>
      )}

      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(section.content),
        }}
      />
    </div>
  ))
}
    </section>
  );
}