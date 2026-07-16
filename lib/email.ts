import "server-only";
import { getOrder } from "./db";

// Confirmation email — stubbed this stage. It only logs.
//
// TODO: integrate a real sender (e.g. Resend). Add RESEND_API_KEY to env and:
//   import { Resend } from "resend";
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   await resend.emails.send({ from, to: order.email, subject, html });
export async function sendOrderConfirmation(orderId: string): Promise<void> {
  const order = await getOrder(orderId).catch(() => null);
  if (!order?.email) {
    console.log(`[email stub] order ${orderId} paid — no email on file, skipping.`);
    return;
  }
  console.log(
    `[email stub] would send confirmation for order ${orderId} to ${order.email} ` +
      `(${order.event_name}, ¥${(order.amount_fen / 100).toFixed(0)}).`
  );
}
