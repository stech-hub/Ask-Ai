export default function handler(req, res) {
  const baseUrl = "https://ask-ai-pied.vercel.app";

  // List all your important links
  const links = [
    "/", // Home
    "/#apps",
    "https://full-task-ai.vercel.app/",
    "https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk",
    "https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk",
    "https://icampus.smythe.telligentgh.com/",

    // Affiliate
    "https://jumia.com",
    "https://expertnaire.com",
    "https://amazon.com",
    "https://ebay.com",
    "https://aliexpress.com",

    // Scholarships
    "https://www.opportunitiesforafricans.com/",
    "https://www.chevening.org/",
    "https://www.fulbrightprogram.org/",
    "https://www.daad.de/",
    "https://www.studyabroad.com/",

    // Jobs & Freelancing
    "https://www.jobliberia.com/",
    "https://www.myjobs.com.lr/",
    "https://www.upwork.com/",
    "https://www.fiverr.com/",

    // Telecom & Services
    "https://www.orange.com/lr/",
    "https://www.lonestarcell.com/",
    "https://www.africell.com.lr/",

    // News & Media
    "https://frontpageafricaonline.com/",
    "https://thenewdawnliberia.com/",
    "https://www.bbc.com/news",
    "https://www.cnn.com/",

    // Social / Contact
    "https://wa.me/231777789356",
    "https://www.facebook.com/profile.php?id=61583456361691"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${links.map(link => `
    <url>
      <loc>${link}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join("")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemap);
}
