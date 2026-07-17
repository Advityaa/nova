import { NextResponse } from "next/server";
import { getProvider } from "@/lib/payments";
import { markOrderPaid } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const provider = getProvider();
    
    // airwallexProvider will parse the JSON body and determine status
    const { orderId, status, providerRef } = await provider.verifyCallback(req);

    if (status === "paid" && orderId) {
      const flipped = await markOrderPaid(orderId, providerRef);
      if (flipped) {
        // Send email only if this is the first time we mark it paid
        await sendOrderConfirmation(orderId).catch((err) => {
          console.error("Failed to send order confirmation email:", err);
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Airwallex Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
