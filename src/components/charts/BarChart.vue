<template>
  <div class="charts-grid">
    <div class="chart-container">
      <Bar :data="computedBarChartData" :options="barChartOptions" />
    </div>
  </div>
</template>

<script>
import { toRaw } from "vue";
import { mapGetters, mapActions } from "vuex";
import { Bar } from "vue-chartjs";
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
  components: { Bar },
  data() {
    return {
      // Các biểu đồ không liên quan đến dữ liệu động có thể để trong data
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
  computed: {
    ...mapGetters(["allSubject", "allExames"]),
    // Tạo ra mảng các đối tượng subject kèm theo số exam count
    nonZeroSubjects() {
      const subjects = toRaw(this.allSubject) || [];
      const exams = toRaw(this.allExames) || [];
      return subjects
        .map((subject) => {
          const count = exams.filter(
            (exam) => Number(exam.subject) === Number(subject.id)
          ).length;
          return { ...subject, count };
        })
        .filter((subject) => subject.count > 0); // chỉ lấy những môn có count > 0
    },
    examLabels() {
      // Lấy tên của những môn không có số đếm bằng 0
      return this.nonZeroSubjects.map((subject) => subject.name);
    },
    examCounts() {
      // Lấy số đếm tương ứng
      return this.nonZeroSubjects.map((subject) => subject.count);
    },
    computedBarChartData() {
      return {
        labels: this.examLabels,
        datasets: [
          {
            label: "Số lượng đề thi",
            data: this.examCounts,
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(75, 192, 192, 0.8)",
              "rgba(153, 102, 255, 0.8)",
              "rgba(255, 159, 64, 0.8)",
              "rgba(199, 199, 199, 0.8)",
              "rgba(83, 102, 255, 0.8)",
              "rgba(40, 159, 64, 0.8)",
              "rgba(210, 199, 199, 0.8)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(199, 199, 199, 1)",
              "rgba(83, 102, 255, 1)",
              "rgba(40, 159, 64, 1)",
              "rgba(210, 199, 199, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
    },
  },
  methods: {
    ...mapActions(["getSubject", "getExam"]),
  },
  mounted() {
    this.getSubject();
    this.getExam();
    console.log("sssss", this.examCounts);
  },
  watch: {
    allExames() {
      console.log("Exam Counts:", this.examCounts);
    },
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
