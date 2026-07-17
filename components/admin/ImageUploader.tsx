"use client";

import { useState, useRef } from "react";

export default function ImageUploader({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const blob = await res.json();
      setUrl(blob.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="image-uploader">
      <input type="hidden" name={name} value={url} />
      
      {url && (
        <div className="image-uploader-preview" style={{ marginBottom: "0.5rem" }}>
          <img src={url} alt="Preview" style={{ maxHeight: "150px", borderRadius: "4px" }} />
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="admin-btn-ghost"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        <span style={{ fontSize: "0.85rem", color: "#666" }}>
          Or enter URL below:
        </span>
      </div>
      
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        style={{ marginTop: "0.5rem", width: "100%" }}
      />
      
      {error && <div style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</div>}
    </div>
  );
}
