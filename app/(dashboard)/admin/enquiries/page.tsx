import { listEnquiriesAdmin } from "@/lib/db";
import { toggleEnquiry } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const enquiries = await listEnquiriesAdmin();
  const open = enquiries.filter((e) => !e.handled).length;

  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">Inbox</span>
          <h1>Enquiries</h1>
        </div>
        <span className="admin-count">{open} open · {enquiries.length} total</span>
      </header>

      {enquiries.length === 0 ? (
        <div className="admin-card admin-placeholder"><p>No enquiries yet.</p></div>
      ) : (
        <div className="admin-list">
          {enquiries.map((e) => (
            <div className={`enq-card${e.handled ? " done" : ""}`} key={e.id}>
              <div className="enq-top">
                <div>
                  <strong>{e.name}</strong>
                  {e.company && <span className="enq-co"> · {e.company}</span>}
                  {e.event_type && <em className="enq-type">{e.event_type}</em>}
                </div>
                <time>{new Date(e.created_at).toUTCString().slice(5, 22)}</time>
              </div>
              <div className="enq-contact">{e.contact}</div>
              {e.message && <p className="enq-msg">{e.message}</p>}
              <form action={toggleEnquiry} className="enq-action">
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="handled" value={(!e.handled).toString()} />
                <button type="submit" className={`admin-mini${e.handled ? "" : " add"}`}>
                  {e.handled ? "Mark open" : "Mark handled"}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
