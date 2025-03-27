import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ffwrapped",
  description: "A fantasy football blog",
  lastUpdated: true,
  cleanUrls: true,
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
    [
      "meta",
      {
        name: "keywords",
        content:
          "ffwrapped, fantasy, football, blog, stats, analysis, sleeper, api",
      },
    ],
    ["meta", { name: "author", content: "Kevin Tian" }],

    ["meta", { property: "og:title", content: "ffwrapped blog" }],
    [
      "meta",
      { property: "og:description", content: "A fantasy football blog" },
    ],
    ["meta", { property: "og:url", content: "https://blog.ffwrapped.com" }],
    [
      "meta",
      { property: "og:image", content: "https://blog.ffwrapped.com/logo.png" },
    ],
  ],
});
