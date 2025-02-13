<!-- src/components/Modal.vue -->
<template>
  <div v-if="isVisible" class="modal" @click.self="closeModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>{{ modalTitle }}</h2>
      <form @submit.prevent="handleAddUser">
        <div class="input-box">
          <div class="input-group">
            <label for="username">UserName</label>
            <input
              id="username"
              type="text"
              v-model="username"
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
              v-model="hoTen"
              placeholder="Full Name"
              required
            />
          </div>
        </div>
        <div class="input-box">
          <!-- Email Input -->
          <div class="input-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              v-model="email"
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
              v-model="sdt"
              placeholder="Phone Number"
              required
            />
          </div>
        </div>
        <div class="input-box">
          <!-- Password Input -->
          <div class="input-group password-group">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Password"
                required
              />
              <span class="toggle-password" @click="togglePassword">
                <i
                  :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
                ></i>
              </span>
            </div>
          </div>
          <!-- subject Input -->
          <div class="input-group subject-group">
            <label for="subject">subject</label>
            <div class="subject-wrapper">
              <input
                id="subject"
                :type="text"
                v-model="subject"
                placeholder="subject"
                required
              />
              <!-- <span class="toggle-password" @click="togglePassword">
                <i
                  :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
                ></i>
              </span> -->
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-create">
          {{ modalButtonText }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      hoTen: "",
      email: "",
      sdt: "",
      subject: "",
      role: 1, // Default role is user
      showPassword: false,
    };
  },
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
    userForm: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close"); // Emitting event to close modal
    },
    submitForm() {
      this.$emit("submit", this.userForm); // Emitting form data on submit
    },
    async handleAddUser() {
      const { username, password, hoTen, email, sdt, role, subject } = this;

      if (!username || !password || !hoTen || !email || !sdt || !subject) {
        console.error("Please fill in all required fields.");
        return;
      }
      try {
        const result = await this.$store.dispatch("addUser", {
          username,
          password,
          hoTen,
          email,
          sdt,
          role,
          subject,
        });
        if (result.success) {
          alert(result.message); // Hiển thị thông báo đăng nhập thành công
          this.closeModal();
        }
      } catch (error) {
        alert("Đăng ký thất bại");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.input-box {
  display: flex;
  justify-content: space-evenly;
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
  background: rgba(0, 0, 0, 0.7); /* Tăng độ mờ của background */
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease-in-out; /* Hiệu ứng mờ dần khi mở/đóng modal */
}

/* Modal Content Box */
.modal-content {
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;
  width: 80%;
  max-width: 600px;
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
  margin-bottom: 20px;
  text-align: left;
}

label {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  display: block;
  margin-bottom: 8px;
  text-align: left;
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
.password-group {
  position: relative;
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
</style>
