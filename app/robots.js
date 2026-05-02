export default function robots() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://repolib-undira.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/private",
          "/test",
          "/api",
          "/_next",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}