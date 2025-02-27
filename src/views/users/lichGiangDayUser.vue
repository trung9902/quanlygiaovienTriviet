<template>
  <div class="teachingSchedule_main" style="background-color: #223771">
    <menuTopUser />
    <div class="teachingSchedule">
      <navbarUser />
      <div class="schedule-container">
        <div v-for="thu in daysOfWeek" :key="thu.value" class="day-schedule">
          <h3 class="day-title">{{ thu.label }}</h3>
          <div class="sessions">
            <div class="session morning">
              <h4>Buổi sáng</h4>
              <div
                class="lesson"
                v-for="lesson in filterByDayAndSession(thu.value, 'Buổi sáng')"
                :key="lesson.id"
              >
                <span class="lesson-time">Tiết {{ lesson.period }}</span>
                <span class="lesson-name">{{ lesson.subjectName }}</span>
                <span class="lesson-teacher">{{ lesson.roomNumber }}</span>
              </div>
            </div>
            <div class="session afternoon">
              <h4>Buổi chiều</h4>
              <div
                class="lesson"
                v-for="lesson in filterByDayAndSession(thu.value, 'Buổi chiều')"
                :key="lesson.id"
              >
                <span class="lesson-time">Tiết {{ lesson.period }}</span>
                <span class="lesson-name">{{ lesson.subjectName }}</span>
                <span class="lesson-teacher">{{ lesson.roomNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import menuTopUser from "@/components/USER/menuTopUser.vue";
import navbarUser from "@/components/USER/navbarUser.vue";

export default {
  components: {
    menuTopUser,
    navbarUser,
  },

  data() {
    return {
      daysOfWeek: [
        { value: "2", label: "Thứ Hai" },
        { value: "3", label: "Thứ Ba" },
        { value: "4", label: "Thứ Tư" },
        { value: "5", label: "Thứ Năm" },
        { value: "6", label: "Thứ Sáu" },
        { value: "7", label: "Thứ Bảy" },
      ],
    };
  },

  computed: {
    ...mapGetters(["teacherSchedule"]),
  },

  methods: {
    ...mapActions(["GetScheduleByTeacherId"]),

    filterByDayAndSession(dayOfWeek, session) {
      if (!this.teacherSchedule) return [];
      return this.teacherSchedule.filter(
        (lesson) =>
          lesson.dayOfWeek === dayOfWeek && lesson.timeSlot === session
      );
    },
  },

  async created() {
    const teacherId = this.$store.getters.getUserID;
    if (teacherId) {
      try {
        await this.GetScheduleByTeacherId(teacherId);
      } catch (error) {
        console.error("Lỗi khi lấy lịch dạy:", error);
      }
    } else {
      console.error("Không tìm thấy ID giáo viên");
    }
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
.day-schedule {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .day-title {
    color: #2c3e50;
    font-size: 1.5em;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eee;
  }
}

.lesson {
  margin: 8px 0;
  padding: 10px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .lesson-time {
    font-weight: bold;
    color: #2c3e50;
  }

  .lesson-name {
    color: #3498db;
  }

  .lesson-teacher {
    color: #7f8c8d;
  }
}
</style>
