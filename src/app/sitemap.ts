import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { routes } from "@/lib/constants/routes";
import { site } from "@/lib/constants/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    routes.home,
    routes.mobile,
    routes.ai,
    routes.cloud,
    routes.resume,
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: new URL(path, site.url).toString(),
      lastModified: new Date(),
    })),
    ...projects.map((project) => ({
      url: new URL(routes.project(project.slug), site.url).toString(),
      lastModified: new Date(),
    })),
  ];
}
