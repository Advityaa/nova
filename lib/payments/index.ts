// Provider-agnostic payment abstraction.
// The rest of the app talks only to `PaymentProvider` and `getProvider()` — it
// never imports a concrete provider. Adding a real gateway later means writing
// one file (e.g. lib/payments/stripe.ts) and adding a case below.

export interface CheckoutOrder {
  orderId: string;
  amountFen: number; // integer RMB fen
  items: { name: string; qty: number; priceFen: number }[];
  customer: { name: string; email?: string; phone?: string };
  returnUrl: string; // where the customer lands after the (mock) gateway
}

export interface CheckoutResult {
  redirectUrl?: string; // hosted gateway URL to send the customer to
  clientToken?: string; // for embedded/SDK flows
  providerRef: string; // the provider's reference for this checkout
}

export interface CallbackResult {
  orderId: string;
  status: "paid" | "failed";
  providerRef: string;
}

export interface PaymentProvider {
  readonly name: string;
  createCheckout(order: CheckoutOrder): Promise<CheckoutResult>;
  verifyCallback(req: Request): Promise<CallbackResult>;
}

import { mockProvider } from "./mock";

/** The active provider name, chosen via env. Defaults to the mock provider. */
export const PAYMENT_PROVIDER_NAME = process.env.PAYMENT_PROVIDER ?? "mock";

/** Returns the active payment provider. */
export function getProvider(): PaymentProvider {
  switch (PAYMENT_PROVIDER_NAME) {
    case "mock":
      return mockProvider;
    // TODO: real provider here — add the module and a case, nothing else changes:
    // case "stripe":
    //   return stripeProvider;
    // case "airwallex":
    //   return airwallexProvider;
    default:
      throw new Error(
        `Unknown PAYMENT_PROVIDER "${PAYMENT_PROVIDER_NAME}". Set PAYMENT_PROVIDER=mock (or implement the provider).`
      );
  }
}
