"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { addGallery, type FormState } from "@/app/(dashboard)/admin/actions";

function Add() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn admin-btn-inline" disabled={pending}>
      {pending ? "Adding…" : "Add image"}
    </button>
  );
}

export default function AddGalleryForm({ nextSort }: { nextSort: number }) {
  const [state, action] = useFormState<FormState, FormData>(addGallery, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="gallery-add">
      <input name="url" placeholder="Image URL or /images/…" required />
      <input name="caption" placeholder="Caption (optional)" />
      <input name="sort" type="number" defaultValue={nextSort} style={{ width: 80 }} />
      <Add />
      {state?.error && <div className="admin-error" style={{ width: "100%" }}>{state.error}</div>}
    </form>
  );
}
