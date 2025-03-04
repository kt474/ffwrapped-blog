// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import { inject } from "@vercel/analytics";

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    // Client-side only
    if (typeof window !== "undefined") {
      // Inject Vercel Analytics
      inject();
    }
  },
};
