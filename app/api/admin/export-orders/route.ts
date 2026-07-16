import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listOrdersAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const orders = await listOrdersAdmin();

  const headers = [
    "Order ID",
    "Customer Name",
    "Email",
    "Event",
    "Quantity",
    "Amount (Yuan)",
    "Status",
    "Date",
  ];

  const rows = orders.map((o) => [
    o.id,
    `"${o.customer_name.replace(/"/g, '""')}"`,
    o.email || "",
    `"${(o.event_name || "").replace(/"/g, '""')}"`,
    o.item_count,
    (o.amount_fen / 100).toFixed(2),
    o.status,
    new Date(o.created_at).toISOString(),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="nova-customers.csv"',
    },
  });
}
