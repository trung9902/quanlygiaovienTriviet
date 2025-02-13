// store/modules/general.js
import axios from "@/axios";

export default {
  state: {
    Teachers: [],
    Classes: [],
    Subjects: [],
  },
  getters: {
    allClass: (state) => state.Classes,
    allSubject: (state) => state.Subjects,
    allTeachers: (state) => state.Teachers,
  },
  mutations: {
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
  },
};
