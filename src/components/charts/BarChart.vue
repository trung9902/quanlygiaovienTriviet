<template>
  <div class="charts-grid">
    <div class="chart-container">
      <Bar :data="barChartData" :options="barChartOptions" />
    </div>
    <div class="chart-container">
      <Pie :data="pieChart1Data" :options="pieChartOptions" />
    </div>
    <div class="chart-container">
      <Pie :data="pieChart2Data" :options="pieChartOptions" />
    </div>
  </div>
</template>

<script>
import { Bar, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Charts",
  components: { Bar, Pie },
  data() {
    return {
      barChartData: {
        labels: ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Anh", "Sử", "Địa"],
        datasets: [
          {
            label: "Số lượng đề thi",
            data: [40, 20, 12, 8, 15, 25, 10, 5],
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)" /* ... các màu khác ... */,
            ],
            borderColor: ["rgba(255, 99, 132, 1)" /* ... các màu khác ... */],
            borderWidth: 1,
          },
        ],
      },
      pieChart1Data: {
        labels: ["Đã duyệt", "Chưa duyệt"],
        datasets: [
          {
            data: [70, 30],
            backgroundColor: [
              "rgba(75, 192, 192, 0.8)",
              "rgba(255, 99, 132, 0.8)",
            ],
          },
        ],
      },
      pieChart2Data: {
        labels: ["Offline", "Online"],
        datasets: [
          {
            data: [60, 40],
            backgroundColor: [
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 206, 86, 0.8)",
            ],
          },
        ],
      },
      barChartOptions: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Thống kê số lượng đề thi theo môn học",
            font: { size: 16 },
          },
        },
      },
      pieChartOptions: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Thống kê tỷ lệ",
            font: { size: 16 },
          },
        },
      },
    };
  },
};
</script>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
}

.chart-container {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container:first-child {
  grid-column: 1 / -1;
}
</style>
