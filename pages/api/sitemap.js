import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  const baseUrl = "https://ask-ai-pied.vercel.app";

  // Courses
  const courses = {
    "Freshman 1": ["Computer Basics", "Digital Literacy", "Intro to Programming (Python)"],
    "Freshman 2": ["Web Development (HTML, CSS, JS)", "Discrete Math"],
    Sophomore: ["Data Structures", "Algorithms", "Databases"],
    Junior: ["Operating Systems", "Software Engineering", "Computer Networks"],
    Senior: ["AI & Machine Learning", "Cybersecurity", "Final Year Projects"],
  };

  const apps = [
    "/#apps",
    "https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk",
    "https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk",
  ];

  const externalLinks = [
    "https://icampus.smythe.telligentgh.com/",
    "https://jumia.com",
    "https://expertnaire.com",
    "https://www.opportunitiesforafricans.com/",
    "https://www.studyabroad.com/",
    "https://www.orange.com/lr/",
    "https://www.lonestarcell.com/",
    "https://www.upwork.com/",
    "https://www.fiverr.com/",
  ];

  let urls = [`${baseUrl}/`];

  // Add courses as anchors
  Object.keys(courses).forEach((year) => {
    urls.push(`${baseUrl}/#${year.replace(/\s/g, "-")}`);
  });

  // Add apps
  apps.forEach((a) => urls.push(a));

  // Add external links
  externalLinks.forEach((link) => urls.push(link));

  // Build XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
  )
  .join("")}
</urlset>
`;

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}
