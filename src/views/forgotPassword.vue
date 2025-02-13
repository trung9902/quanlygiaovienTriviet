<template>
  <div class="forgot-password-page">
    <div class="form-container">
      <h2>Quên mật khẩu</h2>
      <p class="subtitle">Nhập email của bạn để lấy lại mật khẩu</p>
      <form @submit.prevent="handleForgotPassword">
        <div class="input-group">
          <label>Email</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope"></i>
            <input
              type="email"
              v-model="email"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
        </div>
        <div class="input-group">
          <label>Mã OTP</label>
          <div class="otp-wrapper" style="display: flex; gap: 10px">
            <div class="input-wrapper" style="flex: 1">
              <i class="fas fa-key"></i>
              <input
                type="text"
                v-model="otp"
                placeholder="Nhập mã OTP"
                required
              />
            </div>
            <button
              type="button"
              class="otp-btn"
              @click="requestOTP"
              style="min-width: 100px"
            >
              Nhận mã
            </button>
          </div>
        </div>
        <div class="input-group">
          <label>Mật khẩu mới</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              v-model="newPassword"
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>
        </div>
        <button type="submit" class="submit-btn">
          <span>Gửi yêu cầu</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      </form>
      <div class="back-to-login">
        <a @click="$router.push('/')">Quay lại đăng nhập</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      otp: "",
      newPassword: "",
    };
  },
  methods: {
    ...mapActions(["verifyOtp"]),
    async handleForgotPassword() {
      try {
        const result = await this.verifyOtp({
          otp: this.otp,
          newPassword: this.newPassword,
        });

        if (result.success) {
          alert("Đổi mật khẩu thành công");
          this.$router.push("/");
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert("Có lỗi xảy ra: " + error.message);
      }
    },
    async requestOTP() {
      try {
        const result = await this.$store.dispatch("sendOtp", this.email);

        if (result.success) {
          alert("Mã OTP đã được gửi đến email của bạn");
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert("Có lỗi xảy ra: " + error.message);
      }
    },
  },
};
</script>
<style scoped>
.forgot-password-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  color: #2d3748;
}

h2 {
  margin-bottom: 10px;
  font-size: 28px;
  color: #1a202c;
  font-weight: 700;
}

.subtitle {
  color: #718096;
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.input-group {
  margin-bottom: 25px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #4a5568;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}

.back-to-login {
  margin-top: 20px;
  text-align: center;
}

.back-to-login a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.back-to-login a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .form-container {
    padding: 30px;
  }
}
</style>
