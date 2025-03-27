<template>
  <ClientOnly>
    <div v-if="ApexChart">
      <ApexChart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="topPlayersSeries"
      ></ApexChart>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, computed, shallowRef } from "vue";
import { useData } from "vitepress";

// Get the dark mode state from VitePress
const { isDark } = useData();

const topPlayersSeries = ref([
  {
    name: "Winners",
    data: [68, 63, 60, 49, 41, 41, 41],
  },
]);

// Base chart options that don't change with theme
const baseOptions = {
  chart: {
    type: "bar",
    height: 350,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#00a63e"],
  xaxis: {
    categories: [
      "Ja'Marr Chase",
      "Amon-Ra St. Brown",
      "Bijan Robinson",
      "Justin Jefferson",
      "Jonathan Taylor",
      "Saquon Barkley",
      "CeeDee Lamb",
    ],
    title: {
      text: "Number of Winners",
    },
  },
  tooltip: {
    y: {
      formatter: function (val, { seriesIndex, dataPointIndex }) {
        const percentages = [11.72, 10.86, 10.34, 8.45, 7.07, 7.07, 7.07];
        return `${val} (${percentages[dataPointIndex]}%)`;
      },
    },
  },
};

// Computed chart options that adjust based on dark mode
const chartOptions = computed(() => {
  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      foreColor: isDark.value ? "#f8f9fa" : "#373d3f", // Light text for dark mode, dark text for light mode
      background: "transparent", // Transparent background to match theme
    },
    theme: {
      mode: isDark.value ? "dark" : "light",
    },
    tooltip: {
      ...baseOptions.tooltip,
      theme: isDark.value ? "dark" : "light",
    },
    grid: {
      borderColor: isDark.value ? "#444444" : "#e0e0e0",
    },
  };
});

const ApexChart = shallowRef(null);

onMounted(async () => {
  const module = await import("vue3-apexcharts");
  ApexChart.value = module.default;
});
</script>
