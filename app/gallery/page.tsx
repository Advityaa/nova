import Nav from "@/components/Nav";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";
import { getGalleryImages } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let gallery: string[] = [];
  try {
    gallery = await getGalleryImages();
  } catch (err) {
    console.error(err);
  }

  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <Gallery images={gallery} />
      </main>
      <Footer />
    </SiteProvider>
  );
}
