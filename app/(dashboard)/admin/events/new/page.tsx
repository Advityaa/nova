import EventForm from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default function NewEventPage() {
  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">Events</span>
          <h1>New event</h1>
        </div>
      </header>
      <div className="admin-card">
        <EventForm />
      </div>
      <p className="admin-hint">
        Tip: create the event first, then add ticket tiers on the edit screen.
      </p>
    </div>
  );
}
