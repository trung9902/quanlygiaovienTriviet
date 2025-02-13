<template>
  <div v-if="isVisible" class="modal" @click.self="closeModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>{{ modalTitle }}</h2>
      <form @submit.stop="submitForm">
        <div class="input-box">
          <div class="input-group">
            <label for="username">UserName</label>
            <input
              id="username"
              type="text"
              v-model="localUser.username"
              placeholder="UserName"
              required
            />
          </div>

          <div class="input-group">
            <label for="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              v-model="localUser.fullName"
              placeholder="Full Name"
              required
            />
          </div>
        </div>
        <div class="input-box">
          <div class="input-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              v-model="localUser.email"
              placeholder="Email"
              required
            />
          </div>
          <div class="input-group">
            <label for="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              v-model="localUser.phone"
              placeholder="Phone Number"
              required
            />
          </div>
        </div>
        <div class="input-group">
          <label for="password">Password (Chỉ nhập nếu muốn thay đổi)</label>
          <div class="password-wrapper">
            <input
              id="password"
              :type="passwordVisible ? 'text' : 'password'"
              v-model="localUser.password"
              placeholder="Password (Optional)"
            />
            <span
              class="toggle-password"
              @click="togglePasswordVisibility"
              :title="passwordVisible ? 'Hide Password' : 'Show Password'"
            >
              <i v-if="passwordVisible" class="fas fa-eye"></i>
              <i v-else class="fas fa-eye-slash"></i>
            </span>
            <small v-if="localUser.hasPassword && !localUser.password">
              Mật khẩu cũ sẽ được giữ nguyên nếu không nhập mật khẩu mới.
            </small>
          </div>
        </div>

        <button type="submit" class="btn btn-create" :disabled="isSubmitting">
          {{ modalButtonText }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    modalTitle: {
      type: String,
      required: true,
    },
    modalButtonText: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      default: () => ({}), // Cung cấp default object nếu không truyền
    },
  },
  data() {
    return {
      isSubmitting: false,
      localUser: {
        id: null,
        username: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        hasPassword: true,
      },
      passwordVisible: false,
    };
  },
  watch: {
    // Theo dõi thay đổi của prop user
    user: {
      immediate: true,
      handler(newUser) {
        // Sao chép giá trị từ user prop sang localUser
        this.localUser = {
          id: newUser.id || null,
          username: newUser.username || "",
          fullName: newUser.fullName || "",
          email: newUser.email || "",
          phone: newUser.phone || "",
          password: "", // Luôn reset password
        };
      },
    },
    isVisible(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async submitForm() {
      if (this.isSubmitting) {
        return; // Tránh gửi lại nếu đang xử lý
      }

      this.isSubmitting = true;

      try {
        const userData = { ...this.localUser };
        if (!userData.password) {
          delete userData.password; // Xóa trường password nếu không nhập
        }

        // Kiểm tra dữ liệu hợp lệ
        if (!userData.username || !userData.email) {
          alert("Vui lòng điền đầy đủ thông tin bắt buộc");
          return;
        }

        // Gửi dữ liệu và emit sự kiện
        await this.$emit("submit", userData);
      } catch (error) {
        console.error("Lỗi khi submit:", error);
      } finally {
        this.isSubmitting = false; // Reset trạng thái
      }
    },

    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    async submitUserData(userData) {
      // Gửi dữ liệu và emit sự kiện
      await this.$emit("submit", userData);
    },
    resetForm() {
      // Reset form về trạng thái ban đầu
      this.localUser = {
        id: null,
        username: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
      };
      this.passwordVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.input-box {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Tăng khoảng cách giữa các input */
}

/* General Modal Styles */
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Tăng độ mờ của background */
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease-in-out; /* Hiệu ứng mờ dần khi mở/đóng modal */
}

/* Modal Content Box */
.modal-content {
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 90%;
  max-width: 500px;
  text-align: center;
  animation: modalIn 0.4s ease-out; /* Hiệu ứng vào khi mở modal */
}

/* Modal Animation (Slide and Fade In) */
@keyframes modalIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 32px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease; /* Hiệu ứng đổi màu khi hover */
}

.close:hover {
  color: #e74c3c; /* Đổi màu thành đỏ khi hover */
}

/* Modal Heading */
h2 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

/* Input Styles */
.input-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff; /* Đổi màu viền khi focus */
}

/* Password Field */
.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 12px;
  right: 15px;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #007bff; /* Đổi màu khi hover */
}

/* Submit Button */
button {
  background-color: #007bff;
  padding: 14px 30px;
  color: white;
  font-size: 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* Phóng to nhẹ khi hover */
}

button:focus {
  outline: none;
}

/* Media Query for Small Devices */
@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    padding: 20px;
  }

  h2 {
    font-size: 24px;
  }

  input {
    padding: 10px;
  }

  button {
    padding: 12px 25px;
    font-size: 16px;
  }
}
.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 12px;
  right: 15px;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #007bff; /* Màu xanh khi hover */
}
</style>
