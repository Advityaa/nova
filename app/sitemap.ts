import type { MetadataRoute } from "next";
import { getAllEventSlugs } from "@/lib/db";

const BASE = "https://novaeventsgroup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllEventSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const eventRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/events/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...eventRoutes];
}
