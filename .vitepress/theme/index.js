// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import { inject } from "@vercel/analytics";
import { defineAsyncComponent } from "vue";

import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    if (typeof window !== "undefined") {
      // Inject Vercel Analytics
      inject();
    }
    app.component(
      "Chart1",
      defineAsyncComponent(() => import("../../components/draft/Chart1.vue"))
    );
    app.component(
      "Chart2",
      defineAsyncComponent(() => import("../../components/draft/Chart2.vue"))
    );
    app.component(
      "Chart3",
      defineAsyncComponent(() => import("../../components/draft/Chart3.vue"))
    );
  },
};
