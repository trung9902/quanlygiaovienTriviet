// store/modules/general.js
import axios from "@/axios";
// import { set } from "core-js/core/dict";

export default {
  state: {
    Teachers: [],
    Classes: [],
    Subjects: [],
    schedule: [],
  },
  getters: {
    allClass: (state) => state.Classes,
    allSubject: (state) => state.Subjects,
    allTeachers: (state) => state.Teachers,
    allSchedule: (state) => state.schedule,
  },
  mutations: {
    setSchedule: (state, schedule) => (state.schedule = schedule),
    addSchedule: (state, schedule) => state.schedule.push(...schedule),
    setClasses: (state, Classes) => (state.Classes = Classes),
    setTeachers: (state, Teachers) => (state.Teachers = Teachers),
    setSubject: (state, Subjects) => (state.Subjects = Subjects),
    newTeacher: (state, Teacher) => state.Teachers.push(Teacher),
    newClass: (state, Class) => state.Classes.push(Class),
    newSubject: (state, Subject) => state.Subjects.push(Subject),
  },
  actions: {
    async getClass({ commit }) {
      try {
        const res = await axios.get("/api/TeachingAssignment/ClassAll");
        commit("setClasses", res.data);
      } catch (error) {
        console.error("Lỗi khi lấy lớp:", error);
      }
    },

    async addClass({ commit }, Class) {
      try {
        const res = await axios.post("/api/TeachingAssignment/AddClass", Class);
        commit("newClass", res.data);
        return { success: true, message: "Thêm lớp thành công" };
      } catch (error) {
        console.error("Lỗi khi thêm lớp:", error);
        throw error;
      }
    },

    async getSubject({ commit }) {
      try {
        const res = await axios.get("/api/TeachingAssignment/SubjectAll");
        commit("setSubject", res.data);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách môn học");
      }
    },

    async addSubject({ commit }, Subject) {
      try {
        const res = await axios.post(
          "/api/TeachingAssignment/AddSubject",
          Subject
        );
        commit("newSubject", res.data);
        return { success: true, message: "Thêm môn học thành công" };
      } catch (error) {
        console.error("Lỗi khi thêm môn học:", error);
        throw error;
      }
    },

    async getTeacher({ commit }) {
      try {
        const res = await axios.get("/api/Teachers");
        commit("setTeachers", res.data);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách giáo viên");
      }
    },

    async addTeacher({ commit }, formData) {
      try {
        const res = await axios.post("/api/Teachers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        commit("newTeacher", res.data);
      } catch (error) {
        console.error("Lỗi khi thêm giáo viên:", error);
      }
    },
    // Trong store/modules/general.js
    async updateTeacher({ commit, dispatch }, formData) {
      try {
        const teacherId = formData.get("maGiaoVien");

        const response = await axios.patch(
          `/api/Teachers/${teacherId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 204) {
          commit("updateTeacher", response.data);
          // NoContent
          // Fetch lại dữ liệu sau khi cập nhật
          await dispatch("getTeacher");
          return true;
        }

        return false;
      } catch (error) {
        console.error("Update teacher error:", error.response?.data);
        throw error;
      }
    },
    async getSchedule({ commit }) {
      try {
        const response = await axios.get("/api/Schedule");
        if (response.data.success) {
          commit("setSchedule", response.data.schedule);
        }
      } catch (error) {
        throw new Error("Không thể lấy thời khóa biểu");
      }
    },
    async saveSchedule({ commit, dispatch }, schedules) {
      try {
        await dispatch("deleteAllSchedules");
        // Convert Proxy Array to normal array và format theo yêu cầu API
        const normalSchedules = JSON.parse(JSON.stringify(schedules)).map(
          (schedule) => ({
            ClassId: schedule.classId ? parseInt(schedule.classId) : 0,
            TeacherId: schedule.teacherId ? parseInt(schedule.teacherId) : 0,
            SubjectId: schedule.subjectId ? parseInt(schedule.subjectId) : null,
            DayOfWeek: schedule.dayOfWeek,
            Period: schedule.period ? parseInt(schedule.period) : 0,
            TimeSlot: schedule.timeSlot,
            Semester: schedule.semester ? parseInt(schedule.semester) : 1,
            SchoolYear: schedule.schoolYear,
            RoomNumber: schedule.roomNumber,
          })
        );

        // Log để kiểm tra dữ liệu trước khi gửi
        console.log("Dữ liệu trước khi gửi:", {
          schedule: normalSchedules,
        });

        // Gửi từng request một để lưu từng lịch giảng dạy
        const savePromises = normalSchedules.map((schedule) =>
          axios.post("/api/Schedule", schedule, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        );

        // Đợi tất cả các request hoàn thành
        const responses = await Promise.all(savePromises);

        // Kiểm tra kết quả
        const successfulSaves = responses.filter(
          (response) => response.status === 200 || response.status === 201
        );

        if (successfulSaves.length === normalSchedules.length) {
          commit("setSchedule", normalSchedules);
          return {
            success: true,
            message: `Đã lưu thành công ${successfulSaves.length} lịch giảng dạy`,
            data: responses.map((r) => r.data),
          };
        }

        throw new Error(
          `Đã lưu ${successfulSaves.length}/${normalSchedules.length} lịch giảng dạy`
        );
      } catch (error) {
        console.error("Chi tiết lỗi:", {
          message: error.message,
          response: error.response?.data,
          data: error.response?.data?.errors,
        });

        if (error.response?.data?.errors) {
          const errorMessage = Object.entries(error.response.data.errors)
            .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
            .join("\n");
          throw new Error(`Lỗi xác thực:\n${errorMessage}`);
        }

        throw new Error(error.message || "Lỗi không xác định");
      }
    },
    async deleteAllSchedules({ commit }) {
      try {
        const response = await axios.delete("/api/Schedule/DeleteAll");
        if (response.data) {
          commit("setSchedule", []); // Xóa lịch trong store
          return {
            success: true,
            message: "Đã xóa tất cả lịch giảng dạy",
          };
        }
      } catch (error) {
        console.error("Lỗi khi xóa lịch:", error);
      }
    },
    async GetScheduleByTeacherId({ commit }, id) {
      try {
        const response = await axios.get("/api/Schedule/teacher/" + id);
        if (response.data.success) {
          commit("setSchedule", response.data.schedule);
        }
      } catch (error) {
        throw new Error("Không thể lấy thời khóa biểu");
      }
    },
  },
};
