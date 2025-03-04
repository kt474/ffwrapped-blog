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
        items: [
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
  },
});
