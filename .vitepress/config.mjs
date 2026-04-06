import { defineConfig } from "vitepress";

const siteName = "Fantasy Football Wrapped Blog";
const siteUrl = "https://blog.ffwrapped.com";
const author = "Kevin Tian";
const defaultImage = `${siteUrl}/logo.png`;

function getPagePath(relativePath) {
  if (!relativePath || relativePath === "index.md") {
    return "/";
  }

  return `/${relativePath
    .replace(/(^|\/)index\.md$/, "$1")
    .replace(/\.md$/, "")}`;
}

function toAbsoluteUrl(path) {
  if (!path) return defaultImage;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function toIsoDate(value) {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function buildJsonLd({ url, title, description, image, pageData, pagePath }) {
  const frontmatter = pageData.frontmatter || {};
  const publishedTime = toIsoDate(frontmatter.date);
  const modifiedTime =
    toIsoDate(frontmatter.lastmod) ||
    (pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : undefined);

  if (pagePath === "/") {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: siteName,
      description,
      url,
      image,
      publisher: {
        "@type": "Person",
        name: author,
      },
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: frontmatter.author || author,
    },
    publisher: {
      "@type": "Person",
      name: author,
    },
    isPartOf: {
      "@type": "Blog",
      name: siteName,
      url: siteUrl,
    },
  };

  if (publishedTime) jsonLd.datePublished = publishedTime;
  if (modifiedTime) jsonLd.dateModified = modifiedTime;

  return jsonLd;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: siteName,
  description:
    "Fantasy football, Sleeper API, and data visualization articles from ffwrapped.",
  lang: "en-US",
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: siteUrl,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    sidebar: [
      { text: "Home", link: "/" },
      {
        text: "Posts",
        items: [
          { text: "Does draft pick really matter?", link: "/posts/draft" },
          { text: "How to use the Sleeper API", link: "/posts/tutorial" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/kt474/ffwrapped-blog" },
    ],
    docFooter: {
      prev: false,
      next: false,
    },
    logo: "/logo.png",
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.webp" }],
    ["meta", { name: "author", content: author }],
    ["meta", { name: "theme-color", content: "#1c64f2" }],
  ],
  transformHead({ pageData, title, description }) {
    const pagePath = getPagePath(pageData.relativePath);
    const canonicalUrl = toAbsoluteUrl(pagePath);
    const frontmatter = pageData.frontmatter || {};
    const imageUrl = toAbsoluteUrl(frontmatter.image || "/logo.png");
    const pageTitle = title || siteName;
    const pageDescription = description || frontmatter.description;
    const publishedTime = toIsoDate(frontmatter.date);
    const modifiedTime =
      toIsoDate(frontmatter.lastmod) ||
      (pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : undefined);
    const isArticle = pagePath !== "/";
    const jsonLd = buildJsonLd({
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      image: imageUrl,
      pageData,
      pagePath,
    });

    const tags = [
      ["link", { rel: "canonical", href: canonicalUrl }],
      ["meta", { property: "og:site_name", content: siteName }],
      ["meta", { property: "og:type", content: isArticle ? "article" : "website" }],
      ["meta", { property: "og:title", content: pageTitle }],
      ["meta", { property: "og:description", content: pageDescription }],
      ["meta", { property: "og:url", content: canonicalUrl }],
      ["meta", { property: "og:image", content: imageUrl }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: pageTitle }],
      ["meta", { name: "twitter:description", content: pageDescription }],
      ["meta", { name: "twitter:image", content: imageUrl }],
      ["script", { type: "application/ld+json" }, JSON.stringify(jsonLd)],
    ];

    if (publishedTime) {
      tags.push(["meta", { property: "article:published_time", content: publishedTime }]);
    }

    if (modifiedTime) {
      tags.push(["meta", { property: "article:modified_time", content: modifiedTime }]);
    }

    if (frontmatter.tags?.length) {
      for (const tag of frontmatter.tags) {
        tags.push(["meta", { property: "article:tag", content: tag }]);
      }
    }

    return tags;
  },
});
