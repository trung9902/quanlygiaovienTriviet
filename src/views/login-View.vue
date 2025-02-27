<template>
  <div class="login-page">
    <!-- Left Section: Login Form -->
    <div class="login-page__form-container">
      <div class="login-page__logo">
        <img
          src="@/assets/TriDuc-logo.png"
          alt="Logo"
          class="login-page__logo-image"
        />
      </div>
      <h1 class="login-page__title">Login</h1>
      <p class="login-page__subtitle">Log into your account</p>

      <form class="login-page__form" @submit.prevent="handleLogin">
        <!-- UserName Input -->
        <div class="input-group">
          <label>UserName</label>
          <input
            type="text"
            v-model="username"
            placeholder="UserName"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="input-group password-group">
          <label>Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            required
          />
          <span class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
          </span>
        </div>

        <!-- Forgot Password -->
        <router-link to="/admin/forgot-password" class="forgot-password"
          >Forgot password?</router-link
        >
        <!-- <a href="#" class="forgot-password">Forgot password?</a> -->

        <!-- Submit Button -->
        <button type="submit" class="login-btn">Log In</button>
      </form>

      <!-- Signup -->
      <p class="signup-link">
        Don't have an account? <router-link to="/registed">Sign up</router-link>
      </p>
    </div>

    <!-- Right Section: Background Image -->
    <div class="login-page__image-container"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      try {
        // Gửi yêu cầu API với tên người dùng và mật khẩu
        const result = await this.$store.dispatch("login", {
          username: this.username,
          password: this.password,
          router: this.$router,
        });
        if (result.success) {
          alert(result.message); // Hiển thị thông báo đăng nhập thành công
        }
      } catch (error) {
        console.error("Đăng nhập thất bại:", error);
        alert("Đăng nhập thất bại");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login-page__logo-image {
  height: 20vh;
}
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Arial", sans-serif;
}

/* Main Container */
.login-page {
  display: flex;
  height: 100vh;
  color: #fff;
  overflow: hidden;
}

/* Left Section */
.login-page__form-container {
  width: 40%;
  background-color: #000;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 0 10px rgba(0, 0, 0, 0.3);
  animation: slide-in 1s ease-out;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.login-page__logo {
  font-size: 50px;
  font-weight: bold;
  color: #00aaff;
  margin-bottom: 10px;
  text-shadow: 2px 2px 10px rgba(0, 170, 255, 0.6);
  transition: text-shadow 0.3s ease;
}

.login-page__logo:hover {
  text-shadow: 2px 2px 20px rgba(0, 170, 255, 1);
}

.login-page__title {
  font-size: 2rem;
  margin: 10px 0;
  opacity: 0.9;
}

.login-page__subtitle {
  color: #aaa;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.login-page__form {
  width: 100%;
  max-width: 300px;
}

.input-group {
  margin-bottom: 15px;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  text-align: left;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #00aaff;
  box-shadow: 0 0 10px rgba(0, 170, 255, 0.5);
  outline: none;
}

.password-group .toggle-password {
  position: absolute;
  right: 10px;
  top: 35px;
  cursor: pointer;
  color: #00aaff;
  transition: color 0.3s ease;
}

.password-group .toggle-password:hover {
  color: #0056b3;
}

.forgot-password {
  display: block;
  text-align: right;
  color: #00aaff;
  font-size: 0.9rem;
  margin-bottom: 20px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #0056b3;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.login-btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.social-icons {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.social-icons button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #333;
  color: #fff;
  margin: 0 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.social-icons button:hover {
  background-color: #00aaff;
  color: #fff;
  transform: scale(1.1);
}

.signup-link {
  margin-top: 10px;
  font-size: 0.9rem;
}

.signup-link a {
  color: #00aaff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: #0056b3;
}

/* Right Section: Background Image */
.login-page__image-container {
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
</style>
