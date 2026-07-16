// Client-side helper: POST the selection to /api/checkout and follow the
// provider's redirect. Knows nothing about which provider is active.
export type CheckoutPayload = {
  eventSlug: string;
  items: { tierId: string; qty: number }[];
  customer: { name: string; email?: string; phone?: string };
};

export async function startCheckout(payload: CheckoutPayload): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Checkout failed.");
  if (data.redirectUrl) {
    window.location.href = data.redirectUrl as string;
    return;
  }
  throw new Error("Payment provider did not return a redirect URL.");
}
