import type { MetadataRoute } from "next";
import { getAllStackSlugs } from "@/features/stacks/queries";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stacks = await getAllStackSlugs();

  const stackUrls: MetadataRoute.Sitemap = stacks.map((stack) => ({
    url: `${SITE_URL}/stacks/${stack.slug}`,
    lastModified: new Date(stack.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...stackUrls,
  ];
}
