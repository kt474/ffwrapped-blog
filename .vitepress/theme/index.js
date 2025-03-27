// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import { inject } from "@vercel/analytics";
import { defineAsyncComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";

import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.use(VueApexCharts);
    // Client-side only
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
    if (typeof window !== "undefined") {
      // Inject Vercel Analytics
      inject();
    }
  },
};
