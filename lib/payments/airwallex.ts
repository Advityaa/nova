import crypto from "crypto";
import type {
  CallbackResult,
  CheckoutOrder,
  CheckoutResult,
  PaymentProvider,
} from "./index";

export const airwallexProvider: PaymentProvider = {
  name: "airwallex",

  async createCheckout(order: CheckoutOrder): Promise<CheckoutResult> {
    const clientId = process.env.AIRWALLEX_CLIENT_ID;
    const apiKey = process.env.AIRWALLEX_API_KEY;
    const isProd = process.env.AIRWALLEX_ENV === "production";
    const baseUrl = isProd
      ? "https://api.airwallex.com"
      : "https://api-demo.airwallex.com";
    const hppUrl = isProd
      ? "https://checkout.airwallex.com/hpp"
      : "https://checkout-demo.airwallex.com/hpp";

    if (!clientId || !apiKey) {
      throw new Error(
        "Missing AIRWALLEX_CLIENT_ID or AIRWALLEX_API_KEY. Please add them to your Vercel environment variables."
      );
    }

    // 1. Authenticate with Airwallex to get bearer token
    const authRes = await fetch(`${baseUrl}/api/v1/authentication/login`, {
      method: "POST",
      headers: {
        "x-client-id": clientId,
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!authRes.ok) {
      throw new Error("Failed to authenticate with Airwallex API");
    }

    const { token } = await authRes.json();

    // 2. Create Payment Intent
    // amountFen is in fen (1/100 of RMB). But we are charging in USD.
    // 800 fen = 1 USD. So amount in USD = amountFen / 800.
    const amountUsd = Number((order.amountFen / 800).toFixed(2));

    const piRes = await fetch(`${baseUrl}/api/v1/pa/payment_intents/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_id: order.orderId,
        amount: amountUsd,
        currency: "USD",
        merchant_order_id: order.orderId,
        return_url: order.returnUrl,
        customer: {
          first_name: order.customer.name,
          email: order.customer.email,
          phone_number: order.customer.phone,
        },
      }),
    });

    if (!piRes.ok) {
      throw new Error("Failed to create Airwallex Payment Intent");
    }

    const piData = await piRes.json();
    const intentId = piData.id;
    const clientSecret = piData.client_secret;

    // 3. Return HPP (Hosted Payment Page) URL
    const redirectUrl = `${hppUrl}?intent_id=${intentId}&client_secret=${clientSecret}`;

    return {
      redirectUrl,
      providerRef: intentId,
    };
  },

  async verifyCallback(req: Request): Promise<CallbackResult> {
    const timestamp = req.headers.get("x-timestamp");
    const signature = req.headers.get("x-signature");
    const secret = process.env.AIRWALLEX_WEBHOOK_SECRET;

    if (!timestamp || !signature) {
      throw new Error("Missing Airwallex webhook signatures");
    }
    if (!secret) {
      throw new Error("Missing AIRWALLEX_WEBHOOK_SECRET");
    }

    // We must read the raw body for signature verification
    const rawBody = await req.text();
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(timestamp + rawBody)
      .digest("hex");

    if (signature !== expectedSig) {
      console.error("Signature verification failed", { signature, expectedSig });
      throw new Error("Invalid Airwallex webhook signature");
    }

    const body = JSON.parse(rawBody);
    const eventType = body.name;
    const intentId = body.data?.object?.id;
    const orderId = body.data?.object?.merchant_order_id;

    if (!intentId || !orderId) {
      throw new Error("Invalid Airwallex webhook payload");
    }

    let status: "paid" | "failed" = "failed";
    if (eventType === "payment_intent.succeeded") {
      status = "paid";
    }

    return {
      orderId,
      providerRef: intentId,
      status,
    };
  },
};
