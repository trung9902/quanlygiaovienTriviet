<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Create New Exam</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="examTitle">Exam Title</label>
          <input
            type="text"
            id="examTitle"
            v-model="examTitle"
            placeholder="Enter exam title"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="classSelect">Class</label>
          <select
            id="classSelect"
            v-model="selectedClass"
            @change="updateClassSub"
            class="form-input"
          >
            <option value="">Select a class</option>
            <option
              v-for="classs in classes"
              :key="classs.id"
              :value="classs.id"
            >
              {{ classs.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="subjectSelect">Subject</label>
          <select
            id="subjectSelect"
            v-model="selectedSubject"
            @change="updateSubjectSub"
            class="form-input"
          >
            <option value="">Select a subject</option>
            <option
              v-for="subject in subjects"
              :key="subject.id"
              :value="subject.id"
            >
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="examDocument">Upload Document</label>
          <div class="file-upload-container">
            <input
              type="file"
              id="examDocument"
              @change="handleFileUpload"
              class="file-input"
              accept=".pdf,.doc,.docx"
            />
            <div class="file-upload-box" @click="triggerFileInput">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>
                {{
                  selectedFile
                    ? selectedFile.name
                    : "Click or drag file to upload"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal">Cancel</button>
        <button class="btn btn-primary" @click="submitForm">Create Exam</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "ModalCreateExam",
  data() {
    return {
      isOpen: false,
      examTitle: "",
      selectedFile: null,
      selectedClass: "",
      selectedClasssub: "",
      selectedSubjectsub: "",
      CreatedBy: "",
      createdByName: "",
      selectedSubject: "",
      subjects: [
        { id: 1, name: "Vật lí" },
        { id: 2, name: "Hóa học" },
        { id: 3, name: "Sinh học" },
        { id: 4, name: "Toán học" },
      ],
      classes: [
        { id: 1, name: "Lớp 12" },
        { id: 2, name: "Lớp 11" },
        { id: 3, name: "Lớp 10" },
      ],
    };
  },
  methods: {
    ...mapActions(["addExam"]),
    updateClassSub(event) {
      const selectedClassId = event.target.value;
      const selectedClass = this.classes.find(
        (classs) => classs.id === parseInt(selectedClassId)
      );
      if (selectedClass) {
        this.selectedClasssub = selectedClass.name;
      } else {
        this.selectedClasssub = "";
      }
    },
    updateSubjectSub(event) {
      const selectedSubjectId = event.target.value;
      const selectedSubject = this.subjects.find(
        (subject) => subject.id === parseInt(selectedSubjectId)
      );
      if (selectedSubject) {
        this.selectedSubjectsub = selectedSubject.name;
      } else {
        this.selectedSubjectsub = "";
      }
    },
    closeModal() {
      this.isOpen = false;
      this.resetForm();
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    triggerFileInput() {
      document.getElementById("examDocument").click();
    },
    resetForm() {
      this.examTitle = "";
      this.selectedFile = null;
      this.selectedClass = "";
      this.selectedSubject = "";
      this.selectedClasssub = "";
      this.selectedSubjectsub = "";
      this.createdByName = "";
      this.CreatedBy = "";
    },
    async submitForm() {
      this.createdByName = this.$store.getters.getUserName;
      this.CreatedBy = this.$store.getters.getUserID;
      console.log(this.CreatedBy);

      // Handle form submission here
      const formData = new FormData();
      formData.append("title", this.examTitle);
      formData.append("file", this.selectedFile);
      formData.append("class", this.selectedClass);
      formData.append("classsub", this.selectedClasssub);
      formData.append("subject", this.selectedSubject);
      formData.append("subjectsub", this.selectedSubjectsub);
      formData.append("createdByName", this.createdByName); // Thêm trường createdByName
      formData.append("CreatedBy", this.CreatedBy); // Thêm trường CreatedBy
      formData.append(
        "FileUrl",
        this.selectedFile ? this.selectedFile.name : ""
      );

      try {
        const result = await this.addExam(formData);
        if (result.success) {
          alert("Đề thi đã được tạo thành công.");
          this.closeModal();
        } else {
          alert("Có lỗi xảy ra khi tạo đề thi.");
        }
      } catch (error) {
        console.error("Lỗi khi tạo đề thi:", error);
        alert("Có lỗi xảy ra khi tạo đề thi.");
      }
    },
  },
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.file-upload-container {
  position: relative;
}

.file-input {
  display: none;
}

.file-upload-box {
  border: 2px dashed #ddd;
  padding: 30px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-box:hover {
  border-color: #007bff;
}

.file-upload-box i {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 10px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>
