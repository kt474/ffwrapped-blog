<template>
  <div ref="chartEl" :style="{ height: height }"></div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";

export default defineComponent({
  name: "ClientApexChart",
  props: {
    type: {
      type: String,
      default: "line",
    },
    options: {
      type: Object,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
    height: {
      type: String,
      default: "350px",
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  setup(props) {
    const chartEl = ref(null);
    let chart = null;

    const initChart = async () => {
      if (typeof window === "undefined" || !chartEl.value) return;

      // Dynamic import - only happens on client side
      const ApexCharts = (await import("apexcharts")).default;

      // Merge the options and series
      const chartOptions = {
        ...props.options,
        chart: {
          ...(props.options.chart || {}),
          type: props.type,
        },
        series: props.series,
      };

      if (chart) {
        chart.destroy();
      }

      chart = new ApexCharts(chartEl.value, chartOptions);
      chart.render();
    };

    // Watch for changes in props to update the chart
    watch(
      () => [props.options, props.series],
      () => {
        if (chart) {
          chart.updateOptions({
            ...props.options,
            series: props.series,
          });
        }
      },
      { deep: true }
    );

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      if (chart) {
        chart.destroy();
      }
    });

    return {
      chartEl,
    };
  },
});
</script>
