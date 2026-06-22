import type { MetadataRoute } from "next";

const SITE_URL = "https://www.abc-fly.com";

/* 운영 라우트 — test/test1 등 실험 페이지는 제외 */
const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/programs", priority: 0.9 },
  { path: "/airline-prep", priority: 0.85 },
  { path: "/flight-school", priority: 0.8 },
  { path: "/app-upp", priority: 0.75 },
  { path: "/pipeline", priority: 0.7 },
  { path: "/apply", priority: 0.7 },
  { path: "/trial", priority: 0.65 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
