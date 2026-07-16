import { NextResponse } from "next/server";
import {
  createOrder,
  getEventForCheckout,
  setOrderProviderRef,
} from "@/lib/db";
import { getProvider, PAYMENT_PROVIDER_NAME } from "@/lib/payments";

export const dynamic = "force-dynamic";

type Body = {
  eventSlug?: string;
  items?: { tierId?: string; qty?: number }[];
  customer?: { name?: string; email?: string; phone?: string };
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { eventSlug, items, customer } = body;
  const name = customer?.name?.trim();

  if (!eventSlug) {
    return NextResponse.json({ error: "Missing eventSlug." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json(
      { error: "A name is required to check out." },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No tickets selected." }, { status: 400 });
  }

  const event = await getEventForCheckout(eventSlug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  // Price every line item from the DB — the client-supplied price is ignored.
  const lineItems: {
    tierId: string;
    name: string;
    qty: number;
    unitPriceFen: number;
  }[] = [];
  for (const item of items) {
    const qty = Math.floor(Number(item.qty) || 0);
    if (qty <= 0) continue;
    const tier = item.tierId ? event.tiers[item.tierId] : undefined;
    if (!tier) {
      return NextResponse.json(
        { error: `Unknown ticket tier: ${item.tierId}` },
        { status: 400 }
      );
    }
    lineItems.push({
      tierId: tier.id,
      name: tier.name,
      qty,
      unitPriceFen: tier.price_fen,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "No tickets selected." }, { status: 400 });
  }

  const amountFen = lineItems.reduce(
    (sum, li) => sum + li.qty * li.unitPriceFen,
    0
  );

  // 1) Create the pending order + items.
  const orderId = await createOrder({
    eventId: event.eventId,
    provider: PAYMENT_PROVIDER_NAME,
    customer: {
      name,
      email: customer?.email?.trim() || undefined,
      phone: customer?.phone?.trim() || undefined,
    },
    amountFen,
    items: lineItems.map((li) => ({
      tierId: li.tierId,
      qty: li.qty,
      unitPriceFen: li.unitPriceFen,
    })),
  });

  // 2) Hand off to the payment provider (whichever is configured).
  const origin = new URL(req.url).origin;
  const returnUrl = `${origin}/checkout/confirmation`;
  const provider = getProvider();
  const result = await provider.createCheckout({
    orderId,
    amountFen,
    items: lineItems.map((li) => ({
      name: li.name,
      qty: li.qty,
      priceFen: li.unitPriceFen,
    })),
    customer: { name, email: customer?.email, phone: customer?.phone },
    returnUrl,
  });

  await setOrderProviderRef(orderId, result.providerRef);

  return NextResponse.json({
    orderId,
    redirectUrl: result.redirectUrl,
    clientToken: result.clientToken,
  });
}
