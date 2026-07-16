import AddGalleryForm from "@/components/admin/AddGalleryForm";
import { listGalleryAdmin } from "@/lib/db";
import { deleteGallery, updateGallery } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await listGalleryAdmin();
  const nextSort = images.length;

  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">Manage</span>
          <h1>Gallery</h1>
        </div>
      </header>

      <div className="admin-card">
        <AddGalleryForm nextSort={nextSort} />
      </div>

      {images.length === 0 ? (
        <div className="admin-card admin-placeholder" style={{ marginTop: 18 }}>
          <p>No gallery images yet.</p>
        </div>
      ) : (
        <div className="gallery-grid-admin">
          {images.map((img) => (
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
      )}
    </div>
  );
}
