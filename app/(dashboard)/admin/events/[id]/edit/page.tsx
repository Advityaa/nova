import Link from "next/link";
import { notFound } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import TierEditor from "@/components/admin/TierEditor";
import { getEventByIdAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getEventByIdAdmin(params.id);
  if (!data) notFound();
  const { event, tiers } = data;

  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">
            Events · <Link href="/admin/events">all</Link>
          </span>
          <h1>Edit: {event.name}</h1>
        </div>
        <Link href={`/events/${event.slug}`} target="_blank" className="admin-btn-ghost">
          View live ↗
        </Link>
      </header>

      <div className="admin-card">
        <EventForm event={event} />
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <TierEditor eventId={event.id} tiers={tiers} />
      </div>
    </div>
  );
}
