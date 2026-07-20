import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

export default function PrivacyPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="sec" style={{ paddingTop: '140px', minHeight: '80vh', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ fontFamily: 'var(--disp)', fontSize: '32px', textTransform: 'uppercase', marginBottom: '24px', color: 'var(--ink)' }}>Privacy Policy (隐私政策)</h1>
        
        <div style={{ color: 'var(--ink-dim)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <p>
            Naiwa (Shanghai) Culture Communication Co., Ltd. (奈瓦(上海)文化传播有限公司) ("we", "us", "our") highly values your privacy and the security of your personal information. This Privacy Policy is formulated in accordance with the <em>Personal Information Protection Law of the People's Republic of China (PIPL)</em> and other relevant regulations to explain how we collect, use, store, and protect your data.
          </p>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>1. How We Collect and Use Your Information</h3>
            <p>We strictly adhere to the principles of lawfulness, fairness, and necessity when collecting your personal information. We collect information for the following core business functions:</p>
            <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginTop: '8px' }}>
              <li><strong>Account Registration & Ticketing:</strong> To comply with real-name authentication laws in the PRC, we may collect your name, valid ID number (e.g., PRC Resident Identity Card, Passport), and mobile phone number.</li>
              <li><strong>Payment Processing:</strong> When purchasing tickets, you will provide payment information. We process payments via authorized third-party gateways (e.g., Airwallex). We do not store your full credit card number or payment passwords on our servers.</li>
              <li><strong>Customer Service:</strong> We may collect your email address, phone number, and communication history to address your inquiries and resolve disputes.</li>
              <li><strong>Security and Operations:</strong> We collect IP addresses, device identifiers, and log data to ensure the security of our platform and prevent fraudulent activities.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>2. How We Share, Transfer, and Disclose Your Information</h3>
            <p>
              We will not sell or illegally provide your personal information to third parties. We may share your information only under the following circumstances:
            </p>
            <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginTop: '8px' }}>
              <li><strong>With Authorized Partners:</strong> Such as payment gateways (e.g., Airwallex), venues, and event organizers, purely for the purpose of fulfilling your ticket purchase and facilitating event entry.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information to competent public security authorities, courts, or other government bodies if required by laws and regulations of the PRC.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>3. Data Storage and Cross-Border Transfer</h3>
            <p>
              In principle, the personal information we collect generated within the territory of the People's Republic of China will be stored in servers located within mainland China. If cross-border data transfer is necessary for business needs (e.g., utilizing international payment systems like Airwallex), we will ensure such transfers strictly comply with the security assessment measures and regulations stipulated by the Cyberspace Administration of China (CAC) and relevant laws.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>4. Protection of Minors</h3>
            <p>
              Our services are primarily directed at adults (aged 18 and above). We do not knowingly collect personal information from minors under the age of 14. If you are a minor, you must obtain explicit consent from your parent or legal guardian before using our services. If we discover that we have collected information from a child under 14 without verifiable parental consent, we will delete the relevant data immediately.
            </p>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>5. Your Rights Regarding Personal Information</h3>
            <p>
              Under the PIPL, you possess the right to access, correct, supplement, and delete your personal information. You also have the right to withdraw your consent for future data collection or request account de-registration. To exercise these rights, please contact our data protection team.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>6. Contact Us</h3>
            <p>
              If you have any questions, complaints, or suggestions regarding this Privacy Policy or your personal information, please contact us:
            </p>
            <p style={{ marginTop: '8px' }}>
              Email: novaeventsshanghai@gmail.com<br />
              Address: No.608 XiKang Road WeWork 03-111, Jing An District, Shanghai, PRC.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </SiteProvider>
  );
}
