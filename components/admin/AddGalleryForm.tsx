"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { addGallery, type FormState } from "@/app/(dashboard)/admin/actions";

function Add() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn admin-btn-inline" disabled={pending}>
      {pending ? "Adding…" : "Add images"}
    </button>
  );
}

export default function AddGalleryForm({ nextSort, events }: { nextSort: number; events: { id: string; name: string }[] }) {
  const [state, action] = useFormState<FormState, FormData>(addGallery, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="gallery-add" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <textarea name="urls" placeholder="Image URLs (one per line, e.g. /images/1.jpg)" required rows={3} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)' }} />
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <select name="event_id" style={{ padding: '8px', background: 'var(--bg-soft)', color: 'var(--ink)', border: '1px solid var(--line)' }}>
          <option value="">General Gallery (No Event)</option>
          {events.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
        <input name="caption" placeholder="Caption (optional)" style={{ flex: 1 }} />
        <input name="sort" type="number" defaultValue={nextSort} style={{ width: 80 }} title="Sort order" />
        <Add />
      </div>

      {state?.error && <div className="admin-error" style={{ width: "100%" }}>{state.error}</div>}
    </form>
  );
}
