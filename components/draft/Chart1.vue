<template>
  <ClientOnly>
    <div v-if="ApexChart">
      <ApexChart
        type="bar"
        height="350"
        :options="draftPositionOptions"
        :series="draftPositionSeries"
      />
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const draftPositionSeries = ref([
  {
    name: "Winners",
    data: [26, 31, 34, 48, 41, 63, 45, 59, 46, 65, 69, 53],
  },
]);

const draftPositionOptions = reactive({
  chart: {
    type: "bar",
    height: 350,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 5,
      dataLabels: {
        position: "top",
      },
    },
  },
  colors: [
    "#ff6467",
    "#ff6467",
    "#ff6467",
    "#ff6467",
    "#ff6467",
    "#ff6467",
    "#2b7fff",
    "#2b7fff",
    "#2b7fff",
    "#2b7fff",
    "#2b7fff",
    "#2b7fff",
  ],
  dataLabels: {
    enabled: false,
    formatter: (val) => val,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    title: {
      text: "Draft Position",
    },
  },
  yaxis: {
    title: {
      text: "Number of Winners",
    },
  },
  tooltip: {
    y: {
      formatter: (val, { dataPointIndex }) => {
        const percentages = [
          4.48, 5.34, 5.86, 8.28, 7.07, 10.86, 7.76, 10.17, 7.93, 11.21, 11.9,
          9.14,
        ];
        return `${val} (${percentages[dataPointIndex]}%)`;
      },
    },
  },
});

const ApexChart = ref(null);

onMounted(async () => {
  const module = await import("vue3-apexcharts");
  ApexChart.value = module.default;
});
</script>
