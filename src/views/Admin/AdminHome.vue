<template>
  <div class="admin">
    <Navbar />
    <div class="admin-content">
      <h1>Trang Quản Trị</h1>

      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Tổng số đề thi</h3>
          <p class="stat-number">150</p>
        </div>
        <div class="stat-card">
          <h3>Tổng số giáo viên</h3>
          <p class="stat-number">45</p>
        </div>
        <div class="stat-card">
          <h3>Đề thi mới tháng này</h3>
          <p class="stat-number">28</p>
        </div>
      </div>

      <div class="charts-container">
        <div class="chart-box">
          <h2>Thống kê đề thi theo môn học</h2>
          <BarChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/navbar.vue";
import BarChart from "@/components/charts/BarChart.vue";

export default {
  name: "AdminView",
  components: {
    Navbar,
    BarChart,
  },
};
</script>

<style scoped lang="scss">
.admin {
  display: flex;
  height: 100vh;
  background-color: #f5f6fa;
}

.admin-content {
  flex: 1;
  padding: 20px;
  width: 96vw;

  h1 {
    margin-bottom: 30px;
    color: #2c3e50;
  }
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: #666;
    margin-bottom: 10px;
  }

  .stat-number {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
  }
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.chart-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 20px;
    color: #2c3e50;
  }
}
</style>
