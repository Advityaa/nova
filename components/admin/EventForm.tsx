"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { saveEvent, type FormState } from "@/app/(dashboard)/admin/actions";
import type { AdminEvent } from "@/lib/db";

const TYPES = ["Techno", "Rooftop", "Pool", "House", "Event"];
const STATUSES = ["draft", "onsale", "soldout", "past"];

// timestamptz -> value for <input type="datetime-local"> (UTC wall-clock)
function toLocalInput(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

function Save() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn" disabled={pending}>
      {pending ? "Saving…" : "Save event"}
    </button>
  );
}

export default function EventForm({ event }: { event?: AdminEvent }) {
  const [state, action] = useFormState<FormState, FormData>(saveEvent, undefined);

  return (
    <form action={action} className="admin-form-grid">
      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="afg-row">
        <label className="afield">
          <span>Name *</span>
          <input name="name" defaultValue={event?.name ?? ""} required />
        </label>
        <label className="afield">
          <span>Slug * (url)</span>
          <input name="slug" defaultValue={event?.slug ?? ""} required placeholder="mass-x-sevenn" />
        </label>
      </div>

      <div className="afg-row">
        <label className="afield">
          <span>Type</span>
          <select name="type" defaultValue={event?.type ?? "Techno"}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="afield">
          <span>Status</span>
          <select name="status" defaultValue={event?.status ?? "draft"}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="afield">
          <span>Badge label</span>
          <input name="status_label" defaultValue={event?.status_label ?? ""} placeholder="Selling fast" />
        </label>
      </div>

      <div className="afg-row">
        <label className="afield">
          <span>Mood color</span>
          <input name="color" type="text" defaultValue={event?.color ?? "#864bff"} placeholder="#864bff" />
        </label>
        <label className="afield">
          <span>Accent ink</span>
          <input name="accent_ink" type="text" defaultValue={event?.accent_ink ?? "#ffffff"} placeholder="#ffffff" />
        </label>
        <label className="afield afield-check">
          <input type="checkbox" name="featured" defaultChecked={event?.featured ?? false} />
          <span>Featured (hero)</span>
        </label>
      </div>

      <label className="afield">
        <span>Lineup</span>
        <input name="lineup" defaultValue={event?.lineup ?? ""} placeholder="SEVENN — Afterlife (USA)" />
      </label>

      <div className="afg-row">
        <label className="afield">
          <span>Venue</span>
          <input name="venue" defaultValue={event?.venue ?? ""} />
        </label>
        <label className="afield">
          <span>Area</span>
          <input name="area" defaultValue={event?.area ?? ""} />
        </label>
      </div>

      <label className="afield">
        <span>Address</span>
        <input name="address" defaultValue={event?.address ?? ""} />
      </label>

      <div className="afg-row">
        <label className="afield">
          <span>Starts at</span>
          <input name="starts_at" type="datetime-local" defaultValue={toLocalInput(event?.starts_at ?? null)} />
        </label>
        <label className="afield">
          <span>Weekday label</span>
          <input name="weekday" defaultValue={event?.weekday ?? ""} placeholder="SAT" />
        </label>
        <label className="afield">
          <span>Doors / time</span>
          <input name="doors" defaultValue={event?.doors ?? ""} placeholder="23:00–late" />
        </label>
      </div>

      <label className="afield">
        <span>Hero image (URL or /images/…)</span>
        <input name="hero_image" defaultValue={event?.hero_image ?? ""} placeholder="/images/event-mass.jpg" />
      </label>

      <label className="afield">
        <span>Description</span>
        <textarea name="description" rows={4} defaultValue={event?.description ?? ""} />
      </label>

      {state?.error && <div className="admin-error">{state.error}</div>}

      <div className="afg-actions">
        <Save />
        <Link href="/admin/events" className="admin-btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
