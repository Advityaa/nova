import { NextResponse } from "next/server";
import { getProvider } from "@/lib/payments";
import { markOrderPaid } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

// The (mock) gateway sends the customer here after "payment". We VERIFY on the
// server and mark the order paid — we never trust a client-side redirect to flip
// the status. A real provider would point its return/webhook URL at an
// equivalent route; only the provider.verifyCallback() implementation differs.
export async function GET(req: Request) {
  const provider = getProvider();
  const { orderId, status, providerRef } = await provider.verifyCallback(req);

  const url = new URL(req.url);
  const returnTo =
    url.searchParams.get("returnTo") || `${url.origin}/checkout/confirmation`;

  if (status === "paid" && orderId) {
    const flipped = await markOrderPaid(orderId, providerRef);
    if (flipped) {
      // Best-effort confirmation email (stubbed this stage).
      await sendOrderConfirmation(orderId).catch(() => {});
    }
  }

  const dest = new URL(returnTo);
  if (orderId) dest.searchParams.set("order", orderId);
  if (status !== "paid") dest.searchParams.set("status", "failed");
  return NextResponse.redirect(dest);
}
