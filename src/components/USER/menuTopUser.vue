<template>
  <div class="menu-top">
    <div class="menu-container">
      <div class="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          v-model="searchQuery"
          @input="handleSearch"
        />
        <i class="fas fa-search search-icon"></i>
      </div>
      <div class="user-info">
        <span class="username">{{ userName }}</span>
        <div class="dropdown">
          <i class="fas fa-user user-icon" @click="handerShowSetting"></i>
          <div
            v-if="
              $store.getters.getUserName &&
              $store.getters.getUserName !== 'Người dùng'
            "
            class="dropdown-menu"
            v-show="isDropdownOpen"
            @click="isDropdownOpen = false"
          >
            <div class="dropdown-item" @click="changePassword">
              <i class="fas fa-key"></i>
              Đổi mật khẩu
            </div>
            <div class="dropdown-item" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
              Đăng xuất
            </div>
            <router-link to="/infoUser">
              <div class="dropdown-item" @click="showPersonalInfo">
                <i class="fas fa-id-card"></i>
                Thông tin cá nhân
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuTopUser",
  data() {
    return {
      isDropdownOpen: false,
      searchQuery: "",
    };
  },
  computed: {
    userName() {
      return this.$store.getters.getUserName;
    },
  },
  methods: {
    handleSearch() {
      // Implement search functionality here
      console.log("Searching:", this.searchQuery);
    },
    handerShowSetting() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async logout() {
      try {
        await this.$store.dispatch("logout");
        // Chuyển hướng về trang login sau khi đăng xuất thành công
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.menu-top {
  background-color: #223771;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
}

.menu-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 17px;
}

.search-box {
  position: relative;
  width: 300px;

  input {
    width: 100%;
    padding: 8px 35px 8px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
  }

  .search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;

  .username {
    font-size: 14px;
    color: #fff;
  }

  .user-icon {
    color: #666;
    font-size: 18px;
  }
}
.dropdown {
  position: relative;
  .dropdown-menu {
    position: absolute;
    top: 28px;
    right: 0;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 8px 0;
    z-index: 1000;
    width: 200px;

    .dropdown-item {
      padding: 8px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      &:hover {
        background: #f5f5f5;
      }

      i {
        color: #666;
      }
    }
  }
}
</style>
