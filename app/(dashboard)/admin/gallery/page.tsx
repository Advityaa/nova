import AddGalleryForm from "@/components/admin/AddGalleryForm";
import { listGalleryAdmin, listEventsAdmin, type AdminGalleryImage } from "@/lib/db";
import { deleteGallery, updateGallery } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await listGalleryAdmin();
  const events = await listEventsAdmin();
  const nextSort = images.length;

  const grouped = images.reduce((acc, img) => {
    const key = img.event_name || "General Gallery";
    if (!acc[key]) acc[key] = [];
    acc[key].push(img);
    return acc;
  }, {} as Record<string, AdminGalleryImage[]>);

  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">Manage</span>
          <h1>Gallery</h1>
        </div>
      </header>

      <div className="admin-card" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '16px', color: 'var(--ink-dim)' }}>Add Multiple Photos</h2>
        <AddGalleryForm nextSort={nextSort} events={events} />
      </div>

      {images.length === 0 ? (
        <div className="admin-card admin-placeholder">
          <p>No gallery images yet.</p>
        </div>
      ) : (
        <div>
          {Object.entries(grouped).map(([folderName, folderImages]) => (
            <div key={folderName} style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: '18px', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '16px' }}>
                📁 {folderName} <span style={{ fontSize: '12px', color: 'var(--ink-dim)' }}>({folderImages.length} photos)</span>
              </h2>
              <div className="gallery-grid-admin">
                {folderImages.map((img) => (
                  <div className="gadmin-item" key={img.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption ?? "Gallery"} />
                    <form action={updateGallery} className="gadmin-meta">
                      <input type="hidden" name="id" value={img.id} />
                      <input name="caption" defaultValue={img.caption ?? ""} placeholder="Caption" />
                      <div className="gadmin-row">
                        <input name="sort" type="number" defaultValue={img.sort} title="Sort order" />
                        <button type="submit" className="admin-mini">Save</button>
                        <button formAction={deleteGallery} className="admin-mini danger">Del</button>
                      </div>
                      <div className="gadmin-url" title={img.url}>{img.url}</div>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
