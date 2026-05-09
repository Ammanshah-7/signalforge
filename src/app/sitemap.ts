import type { MetadataRoute } from "next";

const publicPaths = [
  "",
  "/login",
  "/signup",
  "/forgot-password",
  "/blog",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://signalforge.ai";
  const lastModified = new Date();

  return publicPaths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
