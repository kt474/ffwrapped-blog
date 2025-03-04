// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import { inject } from "@vercel/analytics";
import { onMounted } from "vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    // Extend default theme enhanceApp
    if (DefaultTheme.enhanceApp) {
      DefaultTheme.enhanceApp({ app, router });
    }

    // Setup Vercel Analytics client-side only
    if (typeof window !== "undefined") {
      onMounted(() => {
        inject();
      });
    }
  },
};
