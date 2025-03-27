<template>
  <ClientOnly>
    <div v-if="ApexChart">
      <ApexChart
        type="pie"
        height="350"
        :options="chartOptions"
        :series="playerTypesSeries"
      ></ApexChart>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, computed, shallowRef } from "vue";
import { useData } from "vitepress";

// Get the dark mode state from VitePress
const { isDark } = useData();

// Player Types Pie Chart
const playerTypesSeries = ref([306, 231, 39, 3]);

// Base chart options that don't change with theme
const baseOptions = {
  chart: {
    type: "pie",
    height: 350,
    fontFamily: "inherit",
    toolbar: {
      show: false,
    },
  },
  labels: ["WR", "RB", "QB", "TE"],
  legend: {
    position: "bottom",
  },
  dataLabels: {
    formatter: function (val, opts) {
      return (
        opts.w.config.labels[opts.seriesIndex] + ": " + val.toFixed(1) + "%"
      );
    },
    // Remove default shadows
    style: {
      textOutline: "none",
    },
  },
  tooltip: {
    y: {
      formatter: function (val, { seriesIndex }) {
        const percentages = [52.76, 39.83, 6.72, 0.52, 0.17];
        return `${val} winners (${percentages[seriesIndex]}%)`;
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

// Computed chart options that adjust based on dark mode
const chartOptions = computed(() => {
  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      foreColor: isDark.value ? "#f8f9fa" : "#373d3f",
      background: "transparent",
    },
    theme: {
      mode: isDark.value ? "dark" : "light",
    },
    tooltip: {
      ...baseOptions.tooltip,
      theme: isDark.value ? "dark" : "light",
    },
    stroke: {
      width: 2,
      colors: isDark.value ? ["#121212"] : ["#ffffff"],
    },
    dataLabels: {
      ...baseOptions.dataLabels,
      style: {
        colors: isDark.value ? ["#333"] : ["#333333"],
        textOutline: "none", // Remove the text shadow/outline
      },
      background: {
        enabled: false, // Disable background
      },
      dropShadow: {
        enabled: false, // Disable drop shadows
      },
    },
  };
});

const ApexChart = shallowRef(null);

onMounted(async () => {
  const module = await import("vue3-apexcharts");
  ApexChart.value = module.default;
});
</script>
