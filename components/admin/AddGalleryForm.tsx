"use client";

import { useEffect, useRef, useState } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setUrls("");
    }
  }, [state]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of files) {
      try {
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file,
        });
        if (res.ok) {
          const blob = await res.json();
          newUrls.push(blob.url);
        }
      } catch (err) {
        console.error("Upload failed for", file.name, err);
      }
    }

    setUploading(false);
    setUrls((prev) => (prev ? prev + "\n" + newUrls.join("\n") : newUrls.join("\n")));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form ref={formRef} action={action} className="gallery-add" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "8px" }}>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="admin-btn-ghost"
          disabled={uploading}
        >
          {uploading ? "Uploading files..." : "Upload from Computer"}
        </button>
        <span style={{ fontSize: "0.85rem", color: "var(--ink-dim)" }}>
          Files will automatically upload and paste their URLs below.
        </span>
      </div>

      <textarea 
        name="urls" 
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder="Image URLs (one per line, e.g. /images/1.jpg)" 
        required 
        rows={4} 
        style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)' }} 
      />
      
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
