<template>
  <div class="register-page">
    <loading-spinner v-if="isLoading" />
    <!-- Left Section: Register Form -->
    <div class="register-page__form-container">
      <div class="register-page__logo">V</div>
      <h1 class="register-page__title">Register</h1>
      <p class="register-page__subtitle">Create your account</p>

      <form class="register-page__form" @submit.prevent="handleRegister">
        <!-- UserName Input -->
        <div class="input-group">
          <label for="username">UserName</label>
          <input
            id="username"
            type="text"
            v-model="form.username"
            placeholder="UserName"
            required
          />
        </div>

        <!-- Full Name Input -->
        <div class="input-group">
          <label for="hoTen">Full Name</label>
          <input
            id="hoTen"
            type="text"
            v-model="form.hoTen"
            placeholder="Full Name"
            required
          />
        </div>

        <!-- Email Input -->
        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            placeholder="Email"
            required
          />
        </div>

        <!-- Phone Input -->
        <div class="input-group">
          <label for="sdt">Phone Number</label>
          <input
            id="sdt"
            type="tel"
            v-model="form.sdt"
            placeholder="Phone Number"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="input-group password-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              placeholder="Password"
              required
            />
            <span class="toggle-password" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </span>
          </div>
        </div>

        <!-- subject Input -->
        <div class="input-group subject-group">
          <label>Subjects</label>
          <button
            type="button"
            class="register-btn"
            @click="showSubjectModal = true"
          >
            Chọn môn học
          </button>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="register-btn">Register</button>
      </form>

      <!-- Login Link -->
      <p class="login-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>

    <!-- Subject Modal -->
    <div
      class="subject-modal-overlay"
      v-if="showSubjectModal"
      @click.self="closeSubjectModal"
    >
      <div class="subject-modal-container">
        <h2>Chọn môn học</h2>
        <div class="checkbox-container">
          <div class="form-group">
            <label>Danh sách môn học</label>
            <div class="checkbox-group">
              <label
                v-for="subject in allSubject"
                :key="subject.id"
                class="checkbox-label"
              >
                <input
                  type="checkbox"
                  :value="subject.name"
                  v-model="form.subject"
                />
                {{ subject.name }}
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showSubjectModal = false">
            Đóng
          </button>
          <button class="btn btn-primary" @click="confirmSubjectSelection">
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Right Section: Background Image -->
    <div class="register-page__image-container"></div>
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
        hoTen: "",
        email: "",
        sdt: "",
        role: 1,
        subject: [],
        isLoading: false,
      },
      role: 1, // Default role is user
      showPassword: false,
      showSubjectModal: false,
    };
  },
  methods: {
    ...mapActions(["register", "getSubject"]),
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleRegister() {
      if (
        !this.form.username ||
        !this.form.password ||
        !this.form.hoTen ||
        !this.form.email ||
        !this.form.sdt ||
        this.form.subject.length === 0
      ) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
      }
      try {
        const result = await this.$store.dispatch("register", { ...this.form });
        if (result.success) {
          alert(result.message);
          this.$router.push("/");
        }
      } catch (error) {
        alert("Đăng ký thất bại");
      } finally {
        this.isLoading = false;
      }
    },
    confirmSubjectSelection() {
      this.showSubjectModal = false;
    },
  },
  computed: {
    ...mapGetters(["allSubject"]),
  },
  mounted() {
    this.getSubject();
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  height: 100vh;
  color: #fff;
  overflow: hidden;
}

.register-page__form-container {
  width: 40%;
  background-color: #000;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 0 10px rgba(0, 0, 0, 0.3);
}

.register-page__logo {
  font-size: 50px;
  font-weight: bold;
  color: #00aaff;
  margin-bottom: 10px;
  text-shadow: 2px 2px 10px rgba(0, 170, 255, 0.6);
}

.register-page__title {
  font-size: 2rem;
  margin: 10px 0;
}

.register-page__subtitle {
  color: #aaa;
  margin-bottom: 20px;
}

.register-page__form {
  width: 100%;
  max-width: 300px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
  border-radius: 5px;
}

.password-group .password-wrapper {
  position: relative;
}

.password-group .toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.register-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.register-btn:hover {
  background-color: #0056b3;
}

.login-link {
  margin-top: 10px;
  font-size: 0.9rem;
}

.login-link a {
  color: #00aaff;
}

.register-page__image-container {
  width: 60%;
  background: url("/public/img/le-tong-ket-2021-2022-16.jpg") no-repeat center
    center;
  background-size: cover;
  animation: zoom-in 2s ease-in-out;
}

@keyframes zoom-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.subject-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.subject-modal-container {
  background-color: #000;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #000;
}
.register-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.register-btn i.fa-spinner {
  margin-right: 8px;
}
</style>
