<template>
  <div class="navbar" :class="{ 'navbar-collapsed': isCollapsed }">
    <div class="nav-header">
      <router-link to="/user">
        <div class="logo">
          <img src="@/assets/TriDuc-logo.png" alt="Logo" v-if="!isCollapsed" />
        </div>
      </router-link>
      <div class="toggle-btn" @click="toggleNav">
        <i class="fas fa-bars"></i>
      </div>
    </div>

    <div class="nav-content">
      <div class="menu-section">
        <ul>
          <li>
            <router-link to="/home" class="nav-link">
              <i class="fas fa-home"></i>
              <span v-if="!isCollapsed">Trang chủ</span>
            </router-link>
          </li>
          <li>
            <router-link to="/infoUser" class="nav-link">
              <i class="fas fa-user"></i>
              <span v-if="!isCollapsed">Hồ sơ cá nhân</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="menu-section">
        <ul>
          <li>
            <router-link to="/lichGiangDay" class="nav-link">
              <i class="fas fa-calendar"></i>
              <span v-if="!isCollapsed">Lịch giảng dạy</span>
            </router-link>
          </li>
          <li>
            <router-link to="/topicBank" class="nav-link">
              <i class="fas fa-book"></i>
              <span v-if="!isCollapsed">Ngân hàng đề</span>
            </router-link>
          </li>
        </ul>
      </div>

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
  name: "NavbarUser",
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
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style scoped lang="scss">
.navbar {
  background: #223671;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  width: 20vw;

  &.navbar-collapsed {
    width: 70px;
    .nav-link span {
      color: #fff;
      text-decoration: none;
    }
    .nav-link span,
    .menu-title {
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
  font-size: 20px;
  color: white;

  img {
    width: 14vw;
    height: 21vh;
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
  list-style: none;

  a {
    padding: 8px 0;
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
  color: #fff;
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
