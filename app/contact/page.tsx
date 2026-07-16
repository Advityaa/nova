import Nav from "@/components/Nav";
import SocialSelector from "@/components/SocialSelector";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

export default function ContactPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '80vh' }}>
        <SocialSelector />
        <ContactForm />
      </main>
      <Footer />
    </SiteProvider>
  );
}
