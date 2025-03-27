<template>
  <apexchart
    type="bar"
    height="350"
    :options="topPlayersOptions"
    :series="topPlayersSeries"
  ></apexchart>
</template>

<script setup>
import { ref, reactive } from "vue";

const topPlayersSeries = ref([
  {
    name: "Winners",
    data: [68, 63, 60, 49, 41, 41, 41],
  },
]);

const topPlayersOptions = reactive({
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
});
</script>
