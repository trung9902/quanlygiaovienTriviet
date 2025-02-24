<template>
  <div class="teachingSchedule_main" style="background-color: #223771">
    <menuTopUser />
    <div class="teachingSchedule">
      <navbarUser />
      <div class="schedule-container">
        <div class="day-schedule" v-for="(day, index) in schedule" :key="index">
          <h3 class="day-title">{{ day.name }}</h3>
          <div class="sessions">
            <div class="session morning">
              <h4>Buổi sáng</h4>
              <div
                class="lesson"
                v-for="lesson in day.morning"
                :key="lesson.id"
              >
                <span class="lesson-time">Tiết {{ lesson.period }}</span>
                <span class="lesson-name">{{ lesson.subject }}</span>
                <span class="lesson-teacher">{{ lesson.RoomNumber }}</span>
              </div>
            </div>
            <div class="session afternoon">
              <h4>Buổi chiều</h4>
              <div
                class="lesson"
                v-for="lesson in day.afternoon"
                :key="lesson.id"
              >
                <span class="lesson-time">Tiết {{ lesson.period }}</span>
                <span class="lesson-name">{{ lesson.subject }}</span>
                <span class="lesson-teacher">{{ lesson.RoomNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import menuTopUser from "@/components/USER/menuTopUser.vue";
import navbarUser from "@/components/USER/navbarUser.vue";
export default {
  data() {
    return {
      schedule: [
        {
          name: "Thứ Hai",
          morning: [
            { id: 1, period: 1, subject: "Toán", RoomNumber: "Phong 10N3" },
            { id: 2, period: 2, subject: "Văn", RoomNumber: "Phong 10N3" },
            { id: 3, period: 3, subject: "Anh", RoomNumber: "Phong 10N3" },
            { id: 4, period: 4, subject: "Lý", RoomNumber: "Phong 10N3" },
            { id: 5, period: 5, subject: "Hóa", RoomNumber: "Phong 10N3" },
          ],
          afternoon: [
            { id: 6, period: 1, subject: "Sinh", RoomNumber: "GV F" },
            { id: 7, period: 2, subject: "Sử", RoomNumber: "GV G" },
            { id: 8, period: 3, subject: "Địa", RoomNumber: "GV H" },
            { id: 9, period: 4, subject: "GDCD", RoomNumber: "GV I" },
            { id: 10, period: 5, subject: "Thể dục", RoomNumber: "GV J" },
          ],
        },
      ],
    };
  },
  components: {
    menuTopUser,
    navbarUser,
  },
};
</script>

<style scoped lang="scss">
.teachingSchedule_main {
  height: 100vh;
}
.teachingSchedule {
  display: flex;
  gap: 10px;
}
.schedule-container {
  gap: 10px;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 85vh;
  background: linear-gradient(to right, var(--light-gray), var(--light-blue));
  overflow-y: scroll;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  border: 1px solid #000;
  padding: 39px;
}
.day-schedule {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.day-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}
.sessions {
  display: flex;
  gap: 10px;
}
.session {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
}
.morning {
  background: #e3f2fd;
}
.afternoon {
  background: #ffebee;
}
.lesson {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}
</style>
