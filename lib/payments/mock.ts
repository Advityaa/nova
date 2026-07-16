import { randomUUID } from "node:crypto";
import type {
  CallbackResult,
  CheckoutOrder,
  CheckoutResult,
  PaymentProvider,
} from "./index";

// Mock payment provider — NO real money moves. It stands in for a hosted
// gateway: createCheckout() hands back a redirect URL pointing at our own mock
// "gateway callback" route, which then verifies and bounces the customer to the
// confirmation page. This mirrors the real redirect→callback→verify shape so a
// real provider slots in without changing the flow.
//
// TODO: real provider here — replace this file's body with the gateway SDK.
// `createCheckout` should return the gateway's hosted `redirectUrl`; and
// `verifyCallback` should verify the gateway's signature/webhook, not trust the
// query string.
export const mockProvider: PaymentProvider = {
  name: "mock",

  async createCheckout(order: CheckoutOrder): Promise<CheckoutResult> {
    const providerRef = `mock_${randomUUID()}`;

    // The mock "gateway URL" is our own callback route. A real provider would
    // return its own hosted checkout URL here instead.
    const origin = new URL(order.returnUrl).origin;
    const url = new URL("/api/payments/mock/callback", origin);
    url.searchParams.set("orderId", order.orderId);
    url.searchParams.set("ref", providerRef);
    url.searchParams.set("outcome", "paid"); // mock always succeeds
    url.searchParams.set("returnTo", order.returnUrl);

    return { redirectUrl: url.toString(), providerRef };
  },

  async verifyCallback(req: Request): Promise<CallbackResult> {
    // In a real provider this verifies a signed webhook / server-to-server
    // confirmation. The mock reads its own signed-ish query params.
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId") ?? "";
    const providerRef = url.searchParams.get("ref") ?? "";
    const outcome = url.searchParams.get("outcome");
    return {
      orderId,
      providerRef,
      status: outcome === "failed" ? "failed" : "paid",
    };
  },
};
