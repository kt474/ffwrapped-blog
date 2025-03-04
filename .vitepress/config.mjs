import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ffwrapped blog",
  description: "A fantasy football blog",
  head: [["link", { rel: "icon", href: "/favicon.webp" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    sidebar: [
      {
        items: [{ text: "Home", link: "/index" }],
      },
      {
        text: "Posts",
        items: [{ text: "Sleeper API Visualization", link: "/posts/tutorial" }],
      },
    ],
    docFooter: {
      prev: false,
      next: false,
    },
  },
});
