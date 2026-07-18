import { getEventBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default async function CheckoutPage({
  params,
}: {
  params: { slug: string };
}) {
  const ev = await getEventBySlug(params.slug);

  if (!ev) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0A0A0C]">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
          <CheckoutClient ev={ev} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
