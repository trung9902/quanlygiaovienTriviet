<template>
  <div class="vertical-menu">
    <div class="menu-header">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h3>Menu</h3>
    </div>
    <nav>
      <router-link to="/home" class="menu-item">
        <i class="fas fa-home"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/profile" class="menu-item">
        <i class="fas fa-user"></i>
        <span>Profile</span>
      </router-link>
      <router-link to="/settings" class="menu-item">
        <i class="fas fa-cog"></i>
        <span>Settings</span>
      </router-link>
      <router-link to="/topicBank" class="menu-item">
        <i class="fas fa-cog"></i>
        <span>Ngân hàng đề</span>
      </router-link>
      <router-link to="/logout" class="menu-item">
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavbarUser",
};
</script>

<style scoped>
.vertical-menu {
  background-color: #223771;
  color: white;
  padding: 20px 0;
}

.menu-header {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid #34495e;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #34495e;
}

.menu-item i {
  margin-right: 15px;
  width: 20px;
}

.router-link-active {
  background-color: #3498db;
}
</style>
