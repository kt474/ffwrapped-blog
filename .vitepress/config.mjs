import { defineConfig } from "vitepress";

const siteName = "Fantasy Football Wrapped Blog";
const siteUrl = "https://blog.ffwrapped.com";
const mainSiteUrl = "https://ffwrapped.com";
const author = "Kevin Tian";
const defaultImage = `${siteUrl}/logo.png`;
const defaultDescription =
  "Data-driven fantasy football articles, Sleeper API tutorials, and league analysis from ffwrapped.";
const organization = {
  "@type": "Organization",
  name: "ffwrapped",
  url: mainSiteUrl,
  logo: defaultImage,
};

const posts = [
  {
    text: "FAAB vs Rolling Waivers",
    link: "/posts/faab-vs-rolling-waivers",
  },
  {
    text: "How to Prepare for Your Fantasy Football Draft",
    link: "/posts/prepare-for-sleeper-draft",
  },
  {
    text: "The Unluckiest Team in Your Fantasy Football League",
    link: "/posts/unluckiest-team",
  },
  { text: "Does draft pick really matter?", link: "/posts/draft" },
  { text: "How to use the Sleeper API", link: "/posts/tutorial" },
];

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
  const isPost = pagePath.startsWith("/posts/") && pagePath !== "/posts/";
  const publishedTime = toIsoDate(frontmatter.date);
  const modifiedTime =
    toIsoDate(frontmatter.lastmod) ||
    (pageData.lastUpdated
      ? new Date(pageData.lastUpdated).toISOString()
      : undefined);
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ffwrapped",
        item: mainSiteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: siteName,
        item: siteUrl,
      },
    ],
  };

  if (pagePath === "/") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        organization,
        {
          "@type": "WebSite",
          name: siteName,
          description,
          url,
          publisher: organization,
        },
        {
          "@type": "Blog",
          name: siteName,
          description,
          url,
          image,
          publisher: organization,
        },
      ],
    };
  }

  if (!isPost) {
    breadcrumbs.itemListElement.push({
      "@type": "ListItem",
      position: 3,
      name: title,
      item: url,
    });

    return {
      "@context": "https://schema.org",
      "@graph": [
        organization,
        breadcrumbs,
        {
          "@type": "CollectionPage",
          name: title,
          description,
          url,
          isPartOf: {
            "@type": "Blog",
            name: siteName,
            url: siteUrl,
          },
          publisher: organization,
        },
      ],
    };
  }

  breadcrumbs.itemListElement.push({
    "@type": "ListItem",
    position: 3,
    name: title,
    item: url,
  });

  const jsonLd = {
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      name: frontmatter.author || author,
    },
    publisher: organization,
    isPartOf: {
      "@type": "Blog",
      name: siteName,
      url: siteUrl,
    },
  };

  if (publishedTime) jsonLd.datePublished = publishedTime;
  if (modifiedTime) jsonLd.dateModified = modifiedTime;

  return {
    "@context": "https://schema.org",
    "@graph": [organization, breadcrumbs, jsonLd],
  };
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: siteName,
  description: defaultDescription,
  lang: "en-US",
  lastUpdated: true,
  cleanUrls: true,
  srcExclude: ["README.md"],
  sitemap: {
    hostname: siteUrl,
    transformItems(items) {
      return items
        .filter((item) => item.url !== "/README")
        .map((item) => ({
          ...item,
          changefreq:
            item.url === "" || item.url === "/" ? "weekly" : "monthly",
          priority: item.url === "" || item.url === "/" ? 0.8 : 0.7,
        }));
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Blog", link: "/" },
      { text: "All Posts", link: "/posts/" },
      { text: "ffwrapped", link: mainSiteUrl },
    ],
    sidebar: [
      { text: "Home", link: "/" },
      {
        text: "Posts",
        items: [{ text: "All posts", link: "/posts/" }, ...posts],
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
    [
      "meta",
      { name: "robots", content: "index,follow,max-image-preview:large" },
    ],
  ],
  transformHead({ pageData, title, description }) {
    const pagePath = getPagePath(pageData.relativePath);
    const canonicalUrl = toAbsoluteUrl(pagePath);
    const frontmatter = pageData.frontmatter || {};
    const imageUrl = toAbsoluteUrl(frontmatter.image || "/logo.png");
    const pageTitle = frontmatter.title || title || siteName;
    const pageDescription =
      description || frontmatter.description || defaultDescription;
    const publishedTime = toIsoDate(frontmatter.date);
    const modifiedTime =
      toIsoDate(frontmatter.lastmod) ||
      (pageData.lastUpdated
        ? new Date(pageData.lastUpdated).toISOString()
        : undefined);
    const isArticle = pagePath.startsWith("/posts/") && pagePath !== "/posts/";
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
      ["meta", { property: "og:locale", content: "en_US" }],
      [
        "meta",
        { property: "og:type", content: isArticle ? "article" : "website" },
      ],
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
      tags.push([
        "meta",
        { property: "article:published_time", content: publishedTime },
      ]);
    }

    if (modifiedTime) {
      tags.push([
        "meta",
        { property: "article:modified_time", content: modifiedTime },
      ]);
    }

    if (frontmatter.tags?.length) {
      tags.push([
        "meta",
        { property: "article:author", content: frontmatter.author || author },
      ]);

      for (const tag of frontmatter.tags) {
        tags.push(["meta", { property: "article:tag", content: tag }]);
      }
    }

    return tags;
  },
});
