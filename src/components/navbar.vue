<template>
  <!-- <navbar /> -->
  <div class="navbar" :class="{ 'navbar-collapsed': isCollapsed }">
    <div class="nav-header">
      <router-link to="/admin">
        <div class="logo">
          <img src="@/assets/TriDuc-logo.png" alt="Logo" v-if="!isCollapsed" />
          <span v-if="!isCollapsed">Admin Panel</span>
        </div>
      </router-link>
      <div class="toggle-btn" @click="toggleNav">
        <i class="fas fa-bars"></i>
      </div>
    </div>

    <div class="nav-content">
      <div class="menu-section">
        <span class="menu-title" v-if="!isCollapsed">QUẢN LÝ</span>
        <ul>
          <li>
            <router-link to="/admin" class="nav-link">
              <i class="fas fa-home"></i>
              <span v-if="!isCollapsed">Trang chủ</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/AddUser" class="nav-link">
              <i class="fas fa-users"></i>
              <span v-if="!isCollapsed">Quản lý tài khoản</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/teachers" class="nav-link">
              <i class="fas fa-chalkboard-teacher"></i>
              <span v-if="!isCollapsed">Giáo Viên</span>
            </router-link>
          </li>
          <li>
            <router-link to="/automaticAssignment" class="nav-link">
              <i class="fas fa-tasks"></i>
              <span v-if="!isCollapsed">Phân Công</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="menu-section">
        <span class="menu-title" v-if="!isCollapsed">NỘI DUNG</span>
        <ul>
          <li>
            <div class="nav-link menu-item" @click="toggleMenu">
              <i class="fa-regular fa-newspaper"></i>
              <span v-if="!isCollapsed">Tin tức & Hoạt động</span>
              <i
                class="fa-solid fa-chevron-down arrow"
                v-if="!isCollapsed"
                :class="{ rotated: isExpanded }"
              ></i>
            </div>
            <transition name="slide">
              <ul v-show="isExpanded" class="sub-menu">
                <li>
                  <router-link to="/admin/newsAdmin">
                    <i class="fas fa-newspaper"></i>
                    <span>Tin tức</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/admin/CategoryNewsAdmin">
                    <i class="fas fa-list"></i>
                    <span>Danh mục tin tức</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/AdminComment">
                    <i class="fas fa-comments"></i>
                    <span>bình luận</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </li>
          <li>
            <router-link to="/topicBankAdmin" class="nav-link">
              <i class="fas fa-book"></i>
              <span v-if="!isCollapsed">Ngân hàng Đề</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Logout Section -->
      <div class="logout-section">
        <button class="logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!isCollapsed">Đăng xuất</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavbarHome",
  data() {
    return {
      isCollapsed: false,
      isExpanded: false,
    };
  },

  methods: {
    toggleNav() {
      this.isCollapsed = !this.isCollapsed;
      this.$store.commit("auth/setNavbarCollapsed", this.isCollapsed);
    },
    toggleMenu() {
      this.isExpanded = !this.isExpanded;
    },
    handleLogout() {
      // Xử lý đăng xuất ở đây

      this.$store.dispatch("logout", this.$router);
    },
  },
};
</script>

<style scoped lang="scss">
.navbar {
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
  height: 100vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 24vw;

  &.navbar-collapsed {
    width: 70px;

    .nav-link span {
      opacity: 0;
      visibility: hidden;
    }
  }
}

.nav-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;

  img {
    width: 4vw;
    height: 56px;
    object-fit: contain;
  }

  span {
    font-weight: 600;
    font-size: 18px;
  }
}

.toggle-btn {
  color: white;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.nav-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-section {
  margin-bottom: 24px;

  .menu-title {
    padding: 0 24px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    display: block;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s;
  border-radius: 0 20px 20px 0;
  margin-right: 16px;

  &:hover,
  &.router-link-active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  i {
    width: 20px;
    font-size: 18px;
    margin-right: 12px;
  }

  span {
    transition: all 0.3s;
  }
}

.sub-menu {
  padding-left: 46px;
  margin-top: 4px;
  list-style-type: none;

  a {
    padding: 8px 0px;
    font-size: 14px;
    opacity: 0.9;
    color: #fff;
    text-decoration: none;
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.arrow {
  margin-left: auto;
  transition: transform 0.3s;

  &.rotated {
    transform: rotate(180deg);
  }
}

.logout-section {
  margin-top: auto;
  padding: 0 24px;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px;
  border: none;
  background: rgb(255 255 255 / 23%);
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 59, 48, 0.2);
  }

  i {
    margin-right: 12px;
  }
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
