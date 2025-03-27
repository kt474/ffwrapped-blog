<template>
  <apexchart
    type="pie"
    height="350"
    :options="playerTypesOptions"
    :series="playerTypesSeries"
  ></apexchart>
</template>

<script setup>
import { ref, reactive } from "vue";

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
</script>

<style scoped></style>
