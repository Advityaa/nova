import { deleteTier, saveTier } from "@/app/(dashboard)/admin/actions";
import type { AdminTier } from "@/lib/db";

export default function TierEditor({
  eventId,
  tiers,
}: {
  eventId: string;
  tiers: AdminTier[];
}) {
  return (
    <div className="tier-editor">
      <div className="admin-subhead">
        <h2>Ticket tiers</h2>
        <span>Prices in $ (stored as fen). {tiers.length} tier(s).</span>
      </div>

      <div className="tier-table">
        <div className="tier-head">
          <span>Name</span>
          <span>Description</span>
          <span>Price $</span>
          <span>Cap</span>
          <span>Sold</span>
          <span>Sort</span>
          <span></span>
        </div>

        {tiers.map((t) => (
          <form key={t.id} action={saveTier} className="tier-row">
            <input type="hidden" name="tier_id" value={t.id} />
            <input type="hidden" name="event_id" value={eventId} />
            <input name="name" defaultValue={t.name} />
            <input name="description" defaultValue={t.description ?? ""} />
            <input name="price" type="number" step="0.01" min="0" defaultValue={t.price_fen / 800} />
            <input name="capacity" type="number" min="0" defaultValue={t.capacity ?? ""} />
            <span className="tier-sold">{t.sold}</span>
            <input name="sort" type="number" defaultValue={t.sort} />
            <span className="tier-actions">
              <button type="submit" className="admin-mini">Save</button>
              <button formAction={deleteTier} className="admin-mini danger">Del</button>
            </span>
          </form>
        ))}

        {/* add new tier */}
        <form action={saveTier} className="tier-row tier-new">
          <input type="hidden" name="event_id" value={eventId} />
          <input name="name" placeholder="New tier name" />
          <input name="description" placeholder="Description" />
          <input name="price" type="number" step="0.01" min="0" placeholder="0.00" />
          <input name="capacity" type="number" min="0" placeholder="—" />
          <span className="tier-sold">0</span>
          <input name="sort" type="number" defaultValue={tiers.length} />
          <span className="tier-actions">
            <button type="submit" className="admin-mini add">Add</button>
          </span>
        </form>
      </div>
    </div>
  );
}
