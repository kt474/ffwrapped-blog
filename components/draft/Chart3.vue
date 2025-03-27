<template>
  <ClientOnly>
    <div v-if="ApexChart">
      <ApexChart
        type="pie"
        height="350"
        :options="playerTypesOptions"
        :series="playerTypesSeries"
      ></ApexChart>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

// Player Types Pie Chart
const playerTypesSeries = ref([306, 231, 39, 3]);

const playerTypesOptions = reactive({
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
});
const ApexChart = ref(null);

onMounted(async () => {
  const module = await import("vue3-apexcharts");
  ApexChart.value = module.default;
});
</script>
