import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

export default function RefundsPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="sec" style={{ paddingTop: '140px', minHeight: '80vh', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ fontFamily: 'var(--disp)', fontSize: '32px', textTransform: 'uppercase', marginBottom: '24px', color: 'var(--ink)' }}>Refunds & Cancellation Policy (退换票政策)</h1>
        
        <div style={{ color: 'var(--ink-dim)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <p>
            Welcome to Nova Events Shanghai. This Refunds & Cancellation Policy is established by Naiwa (Shanghai) Culture Communication Co., Ltd. (奈瓦(上海)文化传播有限公司) ("we," "us," or "our"). By purchasing tickets, tables, or services on our platform, you acknowledge and agree to the terms outlined below.
          </p>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>1. Special Nature of Goods and "No Refund" Principle</h3>
            <p>
              In accordance with the <em>Law of the People's Republic of China on the Protection of Consumer Rights and Interests</em> (《中华人民共和国消费者权益保护法》) and relevant online dispute resolution regulations, tickets for live events and performances are considered culturally time-sensitive and limited resources. Therefore, <strong>tickets are NOT subject to the "7-day unconditional return" policy</strong> (不支持七天无理由退款).
            </p>
            <p style={{ marginTop: '8px' }}>
              <strong>All sales are final.</strong> Once a ticket or table reservation is successfully purchased and confirmed, we do not support any requests for refunds, cancellations, or exchanges arising from the user's personal reasons (e.g., scheduling conflicts, illness, transportation issues, or simple change of mind). 
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>2. Real-Name Ticketing and Transferability</h3>
            <p>
              To prevent unauthorized scalping and comply with local regulations, certain events may strictly enforce a real-name ticketing system (实名制购票). If an event is designated as real-name only, tickets are strictly non-transferable. The ID used for purchase must match the physical ID presented at the venue. Any issues arising from mismatched information are the sole responsibility of the purchaser, and no refunds will be granted.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>3. Event Alterations, Postponement, or Cancellation</h3>
            <p>
              In the event of circumstances beyond our control (Force Majeure, including but not limited to governmental actions, venue closures, extreme weather, or sudden unavailability of key performers), the event may be altered, postponed, or canceled.
            </p>
            <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginTop: '8px' }}>
              <li><strong>Postponement/Alteration:</strong> If an event is postponed or the lineup/schedule is reasonably altered, your ticket will remain valid for the new date or revised event. We do not provide refunds for such changes unless explicitly stated by the organizer.</li>
              <li><strong>Cancellation:</strong> If an event is completely canceled by the organizer with no rescheduled date, a refund process will be initiated. Refunds will be issued only for the face value of the ticket to the original payment method. Service fees, processing fees (including payment gateway fees like Airwallex), and any associated travel or accommodation costs are strictly non-refundable.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>4. Fraud and Chargebacks</h3>
            <p>
              We maintain a zero-tolerance policy for fraudulent transactions and unwarranted credit card chargebacks. If you initiate a chargeback for a valid, non-refundable ticket purchase, we reserve the right to ban your account, cancel all current and future tickets without notice, and pursue legal action to recover the disputed funds and associated costs.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '8px' }}>5. Governing Law and Jurisdiction</h3>
            <p>
              This policy is governed by the laws of the People's Republic of China. Any disputes arising from this policy shall be resolved through friendly negotiation. If negotiation fails, either party may submit the dispute to the competent people's court in Jing'an District, Shanghai, PRC.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </SiteProvider>
  );
}
