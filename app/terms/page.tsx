import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

export default function TermsPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="sec" style={{ paddingTop: '140px', minHeight: '80vh', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ fontFamily: 'var(--disp)', fontSize: '32px', textTransform: 'uppercase', marginBottom: '24px', color: 'var(--ink)' }}>User Service Agreement (用户服务协议)</h1>
        
        <div style={{ color: 'var(--ink-dim)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <p>
            Welcome to Nova Events Shanghai. This User Service Agreement ("Agreement") constitutes a legally binding contract between you (the "User") and Naiwa (Shanghai) Culture Communication Co., Ltd. (奈瓦(上海)文化传播有限公司) ("we," "us," or "Company"). 
          </p>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>1. Acceptance of Terms</h3>
            <p>
              By accessing our website, registering an account, or purchasing tickets/services, you confirm that you have full capacity for civil rights and conduct, and you fully understand and agree to this Agreement. If you are under 18 years of age, you must use our services under the supervision of a parent or legal guardian.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>2. Account Registration and Real-Name Authentication</h3>
            <p>
              In accordance with the <em>Cybersecurity Law of the People's Republic of China</em> and relevant regulatory requirements, you may be required to provide authentic, accurate, and complete identity information (including your real name, valid ID/passport number, and mobile phone number) when registering an account or purchasing tickets. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>3. User Code of Conduct</h3>
            <p>
              While using our services, you must strictly comply with all applicable laws and regulations of the PRC. You agree NOT to:
            </p>
            <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginTop: '8px' }}>
              <li>Use the platform to disseminate information that endangers national security, harms national honor, disrupts social order, or violates local laws.</li>
              <li>Engage in malicious ticket hoarding, scalping (黄牛), or using automated software/scripts to purchase tickets.</li>
              <li>Interfere with the normal operation of our website, including introducing viruses or attempting unauthorized access to our servers.</li>
            </ul>
            <p style={{ marginTop: '8px' }}>
              We reserve the right to immediately suspend or terminate your access without refund if we detect any violations of this code of conduct.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>4. Ticketing and Venue Regulations</h3>
            <p>
              Purchasing a ticket provides a revocable license to enter the specified venue. You must adhere to the venue's rules, including dress codes, security checks, and prohibited items policies. The venue reserves the right to refuse admission or eject any person whose conduct is deemed disorderly or non-compliant, without refund.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>5. Payment and Order Processing</h3>
            <p>
              All payments are processed through secure third-party gateways (e.g., Airwallex, WeChat Pay, Alipay). You agree to provide valid and authorized payment information. Your order is not confirmed until full payment is received and an official confirmation is issued by our system.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>6. Limitation of Liability and Force Majeure</h3>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. We are not responsible for service interruptions caused by Force Majeure events, including but not limited to telecommunication failures, government actions, natural disasters, or pandemics.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>7. Governing Law and Dispute Resolution</h3>
            <p>
              The formation, execution, interpretation, and dispute resolution of this Agreement shall be governed by the laws of the People's Republic of China. Any dispute shall be resolved through amicable negotiations; if negotiations fail, either party may file a lawsuit in the competent people's court in Jing'an District, Shanghai, PRC.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>8. Contact Us</h3>
            <p>
              Company: Naiwa (Shanghai) Culture Communication Co., Ltd.<br />
              Address: No.608 XiKang Road WeWork 03-111, Jing An District, Shanghai<br />
              Email: novaeventsshanghai@gmail.com<br />
              Phone: +86 13524177794
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </SiteProvider>
  );
}
