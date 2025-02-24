<template>
  <div class="info-user-page" style="background-color: #223771">
    <menuTopUser />
    <div class="info-user-page_body">
      <navbar-user />

      <div class="profile-container">
        <div class="profile-header">
          <h1>Thông tin giáo viên</h1>
          <p>Quản lý đầy đủ thông tin của bạn</p>
        </div>

        <div class="profile-content">
          <!-- Right Section: Avatar, thống kê -->
          <div class="profile-section profile-section--right">
            <div class="profile-card profile-card--avatar">
              <div class="avatar-wrapper">
                <img
                  class="profile-avatar"
                  :src="userAvatar || defaultAvatar"
                  alt="Profile picture"
                />
                <div class="avatar-overlay">
                  <label for="avatar-upload" class="upload-button">
                    <i class="fas fa-camera"></i>
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    hidden
                    accept="image/*"
                    @change="handleAvatarChange"
                  />
                </div>
              </div>
              <h3 class="profile-name">
                {{ userInfo.HoTen || $store.getters.getUserName }}
              </h3>
              <p class="profile-id">{{ $store.getters.getUserId }}</p>
              <div class="profile-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ teachingHours }}</span>
                  <span class="stat-label">Tiết dạy</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ yearsOfExperience }}</span>
                  <span class="stat-label">Năm kinh nghiệm</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Left Section: Thông tin chi tiết -->
          <div class="profile-section profile-section--left">
            <!-- Thông tin cá nhân -->
            <div class="profile-card">
              <div class="card-header">
                <i class="fas fa-user-circle"></i>
                <h2>Thông tin cá nhân</h2>
                <button
                  class="edit-button"
                  v-if="!isEditingPersonal"
                  @click="startEditPersonal"
                >
                  <i class="fas fa-pen"></i>
                </button>
              </div>
              <div class="card-body">
                <div class="info-grid" v-if="!isEditingPersonal">
                  <div class="info-item">
                    <span class="info-label">Họ tên</span>
                    <span class="info-value">{{ userInfo.HoTen }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Giới tính</span>
                    <span class="info-value">{{ userInfo.GioiTinh }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Ngày sinh</span>
                    <span class="info-value">{{
                      formatDate(userInfo.NgaySinh)
                    }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Nơi sinh</span>
                    <span class="info-value">{{ userInfo.NoiSinh }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">{{ userInfo.Email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Số điện thoại</span>
                    <span class="info-value">{{ userInfo.SDT }}</span>
                  </div>
                </div>
                <div
                  v-else
                  style="
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding: 1rem;
                  "
                >
                  <!-- Chế độ chỉnh sửa thông tin cá nhân -->
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Họ tên</span
                    >
                    <input
                      type="text"
                      v-model="editedPersonal.HoTen"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Giới tính</span
                    >
                    <select
                      v-model="editedPersonal.GioiTinh"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Ngày sinh</span
                    >
                    <input
                      type="date"
                      v-model="editedPersonal.NgaySinh"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Nơi sinh</span
                    >
                    <input
                      type="text"
                      v-model="editedPersonal.NoiSinh"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Email</span
                    >
                    <input
                      type="email"
                      v-model="editedPersonal.Email"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Số điện thoại</span
                    >
                    <input
                      type="text"
                      v-model="editedPersonal.SDT"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="action-buttons"
                    style="
                      display: flex;
                      justify-content: flex-end;
                      gap: 16px;
                      margin-top: 16px;
                    "
                  >
                    <button
                      @click="savePersonalInfo"
                      style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        background-color: #007bff;
                        color: #fff;
                        transition: background-color 0.3s ease,
                          transform 0.3s ease;
                      "
                    >
                      Lưu
                    </button>
                    <button
                      @click="cancelEditPersonal"
                      style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        background-color: #f0f0f0;
                        color: #333;
                        transition: background-color 0.3s ease,
                          transform 0.3s ease;
                      "
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Địa chỉ thường trú (Sử dụng trường DiaChi) -->
            <div
              class="profile-card"
              style="
                background-color: rgba(255, 255, 255, 0.95);
                border-radius: 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                  0 1px 3px rgba(0, 0, 0, 0.08);
                padding: 2rem;
                margin-bottom: 1.5rem;
                border: 1px solid rgba(229, 231, 235, 0.5);
                transition: all 0.3s ease;
              "
            >
              <div
                class="card-header"
                style="
                  display: flex;
                  align-items: center;
                  gap: 1rem;
                  margin-bottom: 1.5rem;
                  border-bottom: 2px solid #f0f0f0;
                  padding-bottom: 1rem;
                "
              >
                <i class="fas fa-map-marker-alt"></i>
                <h2
                  style="
                    margin: 0;
                    font-size: 1.5rem;
                    color: #2d3748;
                    font-weight: 600;
                  "
                >
                  Địa chỉ thường trú
                </h2>
                <button
                  class="edit-button"
                  v-if="!isEditingAddress"
                  @click="startEditAddress"
                  style="
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 1.1rem;
                    color: #4299e1;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                  "
                >
                  <i class="fas fa-pen"></i>
                </button>
              </div>
              <div class="card-body">
                <div
                  class="info-grid"
                  v-if="!isEditingAddress"
                  style="display: flex; flex-direction: column; gap: 1rem"
                >
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Địa chỉ</span
                    >
                    <span
                      class="info-value"
                      style="width: 70%; text-align: right; color: #2d3748"
                      >{{ userInfo.DiaChi }}</span
                    >
                  </div>
                </div>
                <div
                  v-else
                  style="
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding: 1rem;
                  "
                >
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Địa chỉ</span
                    >
                    <input
                      type="text"
                      v-model="editedAddress.DiaChi"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="action-buttons"
                    style="
                      display: flex;
                      justify-content: flex-end;
                      gap: 16px;
                      margin-top: 16px;
                    "
                  >
                    <button
                      @click="saveAddress"
                      style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        background-color: #007bff;
                        color: #fff;
                        transition: background-color 0.3s ease,
                          transform 0.3s ease;
                      "
                    >
                      Lưu
                    </button>
                    <button
                      @click="cancelEditAddress"
                      style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        background-color: #f0f0f0;
                        color: #333;
                        transition: background-color 0.3s ease,
                          transform 0.3s ease;
                      "
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thông tin chuyên môn -->
            <div
              class="profile-card"
              style="
                background-color: rgba(255, 255, 255, 0.95);
                border-radius: 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                  0 1px 3px rgba(0, 0, 0, 0.08);
                padding: 2rem;
                margin-bottom: 1.5rem;
                border: 1px solid rgba(229, 231, 235, 0.5);
                transition: all 0.3s ease;
              "
            >
              <div
                class="card-header"
                style="
                  display: flex;
                  align-items: center;
                  gap: 1rem;
                  margin-bottom: 1.5rem;
                  border-bottom: 2px solid #f0f0f0;
                  padding-bottom: 1rem;
                "
              >
                <i class="fas fa-briefcase"></i>
                <h2
                  style="
                    margin: 0;
                    font-size: 1.5rem;
                    color: #2d3748;
                    font-weight: 600;
                  "
                >
                  Thông tin chuyên môn
                </h2>
                <button
                  class="edit-button"
                  v-if="!isEditingProfessional"
                  @click="startEditProfessional"
                  style="
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 1.1rem;
                    color: #4299e1;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                  "
                >
                  <i class="fas fa-pen"></i>
                </button>
              </div>
              <div class="card-body">
                <!-- Hiển thị thông tin chuyên môn -->
                <div
                  class="info-grid"
                  v-if="!isEditingProfessional"
                  style="display: flex; flex-direction: column; gap: 1rem"
                >
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Trình độ học vấn</span
                    >
                    <span
                      class="info-value"
                      style="width: 70%; text-align: right; color: #2d3748"
                      >{{ userInfo.TrinhDoHocVan }}</span
                    >
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Chuyên ngành</span
                    >
                    <span
                      class="info-value"
                      style="width: 70%; text-align: right; color: #2d3748"
                      >{{ userInfo.ChuyenNganh }}</span
                    >
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Kinh nghiệm</span
                    >
                    <span
                      class="info-value"
                      style="width: 70%; text-align: right; color: #2d3748"
                      >{{ userInfo.KinhNghiem }}</span
                    >
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Chứng chỉ</span
                    >
                    <span
                      class="info-value"
                      style="width: 70%; text-align: right; color: #2d3748"
                      >{{ userInfo.ChungChi }}</span
                    >
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Trạng thái</span
                    >
                    <span
                      class="info-value"
                      style="width: 70%; text-align: right; color: #2d3748"
                      >{{ userInfo.TrangThai }}</span
                    >
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Lớp chủ nhiệm</span
                    >
                    <span
                      class="info-value"
                      style="width: 70%; text-align: right; color: #2d3748"
                      >{{ userInfo.lopChuNhiem }}</span
                    >
                  </div>
                  <div
                    class="info-item"
                    style="display: flex; align-items: center; padding: 8px"
                  ></div>
                </div>
                <!-- Chế độ chỉnh sửa -->
                <div
                  v-else
                  style="
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding: 1rem;
                  "
                >
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Trình độ học vấn</span
                    >
                    <input
                      type="text"
                      v-model="editedProfessional.TrinhDoHocVan"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Chuyên ngành</span
                    >
                    <input
                      type="text"
                      v-model="editedProfessional.ChuyenNganh"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Kinh nghiệm</span
                    >
                    <input
                      type="text"
                      v-model="editedProfessional.KinhNghiem"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Chứng chỉ</span
                    >
                    <input
                      type="text"
                      v-model="editedProfessional.ChungChi"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Trạng thái</span
                    >
                    <select
                      v-model="editedProfessional.TrangThai"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    >
                      <option value="Đang làm việc">Đang làm việc</option>
                      <option value="Nghỉ việc">Nghỉ việc</option>
                    </select>
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    <span
                      class="info-label"
                      style="
                        flex: 0 0 30%;
                        font-weight: 600;
                        font-size: 14px;
                        color: #333;
                      "
                      >Lớp chủ nhiệm</span
                    >
                    <input
                      type="text"
                      v-model="editedProfessional.lopChuNhiem"
                      style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        transition: border-color 0.3s ease;
                      "
                    />
                  </div>
                  <div
                    class="info-item"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 1rem;
                      padding: 8px;
                    "
                  ></div>
                  <div
                    class="action-buttons"
                    style="
                      display: flex;
                      justify-content: flex-end;
                      gap: 16px;
                      margin-top: 16px;
                    "
                  >
                    <button
                      @click="saveProfessionalInfo"
                      style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        background-color: #007bff;
                        color: #fff;
                        transition: background-color 0.3s ease,
                          transform 0.3s ease;
                      "
                    >
                      Lưu
                    </button>
                    <button
                      @click="cancelEditProfessional"
                      style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        background-color: #f0f0f0;
                        color: #333;
                        transition: background-color 0.3s ease,
                          transform 0.3s ease;
                      "
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- End Thông tin chuyên môn -->
          </div>
          <!-- End Left Section -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import menuTopUser from "@/components/USER/menuTopUser.vue";
import NavbarUser from "@/components/USER/navbarUser.vue";
import { mapGetters, mapActions } from "vuex";
import { toRaw } from "vue";

export default {
  name: "ProfilePage",
  components: {
    NavbarUser,
    menuTopUser,
  },
  data() {
    return {
      defaultAvatar: require("@/assets/logo.png"), // Thêm ảnh mặc định
      userInfo: {
        MaGiaoVien: null,
        HoTen: "",
        GioiTinh: "",
        NgaySinh: "",
        NoiSinh: "",
        DiaChi: "",
        SDT: "",
        Email: "",
        TrinhDoHocVan: "",
        ChuyenNganh: "",
        KinhNghiem: "",
        ChungChi: "",
        TrangThai: "",
        AnhHoSo: "",
        TaiLieuLienQuan: "",
        lopChuNhiemId: null,
        lopChuNhiem: "",
        Subject: [],
      },
      teachingHours: 0,
      yearsOfExperience: 0,
      isEditingPersonal: false,
      isEditingAddress: false,
      isEditingProfessional: false,
      editedPersonal: {},
      editedAddress: {},
      editedProfessional: {},
    };
  },
  async created() {
    try {
      await this.fetchUserData();
      // Log để kiểm tra
      console.log("MaGiaoVien:", this.userInfo.MaGiaoVien);
    } catch (error) {
      console.error("Lỗi khi khởi tạo component:", error);
    }
  },
  computed: {
    ...mapGetters(["getUserID", "allTeachers"]),
    teacherInfo() {
      const teachers = toRaw(this.allTeachers);
      console.log("All teachers:", teachers);
      console.log("Current getUserID:", this.getUserID);

      const teacher = teachers.find((t) => t.userId === this.getUserID);
      console.log("Found teacher:", teacher);

      return teacher || {};
    },
  },
  methods: {
    ...mapActions(["updateTeacher", "getTeacher", "updateTeacher"]),

    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },

    async handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("id", this.userInfo.MaGiaoVien);
      formData.append("AnhHoSo", file);

      try {
        await this.updateTeacher(formData);
      } catch (error) {
        console.error("Lỗi khi cập nhật ảnh:", error);
      }
    },

    async savePersonalInfo() {
      console.log(this.editedPersonal.NgaySinh);

      try {
        // Lấy ID từ teacherInfo
        const teacherId = this.teacherInfo.maGiaoVien;
        const userId = this.getUserID; // Lấy userId từ getter

        if (!teacherId) {
          console.error("Không tìm thấy mã giáo viên!");
          return;
        }

        // Tạo FormData
        const formData = new FormData();
        formData.append("maGiaoVien", teacherId);
        formData.append("UserId", userId); // Thêm UserId

        // Thêm các trường bắt buộc
        if (this.userInfo.Subject && Array.isArray(this.userInfo.Subject)) {
          formData.append("Subject", JSON.stringify(this.userInfo.Subject));
        } else {
          formData.append("Subject", JSON.stringify([])); // Gửi mảng rỗng nếu không có
        }

        // Thêm ảnh hiện tại nếu có
        if (this.userInfo.AnhHoSo) {
          try {
            const response = await fetch(this.userInfo.AnhHoSo);
            const blob = await response.blob();
            formData.append("imageFile", blob, "current-image.jpg");
          } catch (error) {
            console.warn("Không thể lấy ảnh hiện tại:", error);
            // Thêm một file rỗng để tránh lỗi validation
            const emptyBlob = new Blob([""], { type: "image/jpeg" });
            formData.append("imageFile", emptyBlob, "empty.jpg");
          }
        } else {
          // Thêm một file rỗng nếu không có ảnh
          const emptyBlob = new Blob([""], { type: "image/jpeg" });
          formData.append("imageFile", emptyBlob, "empty.jpg");
        }

        // Thêm các trường cập nhật
        if (this.editedPersonal.GioiTinh !== this.userInfo.GioiTinh) {
          formData.append("gioiTinh", this.editedPersonal.GioiTinh);
        }

        if (this.editedPersonal.HoTen !== this.userInfo.HoTen) {
          formData.append("hoTen", this.editedPersonal.HoTen);
        }

        if (this.editedPersonal.NgaySinh !== this.userInfo.NgaySinh) {
          const date = new Date(this.editedPersonal.NgaySinh);
          if (!isNaN(date.getTime())) {
            formData.append("ngaySinh", date.toISOString().split("T")[0]);
          }
        }

        // Log dữ liệu trước khi gửi
        console.log("Dữ liệu gửi đi:", {
          maGiaoVien: teacherId,
          UserId: userId,
          gioiTinh: this.editedPersonal.GioiTinh,
          hoTen: this.editedPersonal.HoTen,
          ngaySinh: this.editedPersonal.NgaySinh,
        });

        // Gọi API cập nhật
        await this.updateTeacher(formData);

        // Cập nhật UI
        this.userInfo = { ...this.userInfo, ...this.editedPersonal };
        this.isEditingPersonal = false;

        alert("Cập nhật thông tin thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật thông tin!");
      }
    },

    async saveAddress() {
      try {
        const teacherId = this.teacherInfo.maGiaoVien;
        const userId = this.getUserID;

        const formData = new FormData();
        formData.append("maGiaoVien", teacherId); // Change from maGiaoVien to id
        formData.append("diaChi", this.editedAddress.DiaChi); // Change from DiaChi to diaChi
        formData.append("UserId", userId); // Thêm UserId
        // Add required fields
        if (this.userInfo.Subject && Array.isArray(this.userInfo.Subject)) {
          formData.append("Subject", JSON.stringify(this.userInfo.Subject));
        } else {
          formData.append("Subject", JSON.stringify([]));
        }

        // Add required imageFile field
        // Thêm ảnh hiện tại nếu có
        if (this.userInfo.AnhHoSo) {
          try {
            const response = await fetch(this.userInfo.AnhHoSo);
            const blob = await response.blob();
            formData.append("imageFile", blob, "current-image.jpg");
          } catch (error) {
            console.warn("Không thể lấy ảnh hiện tại:", error);
            // Thêm một file rỗng để tránh lỗi validation
            const emptyBlob = new Blob([""], { type: "image/jpeg" });
            formData.append("imageFile", emptyBlob, "empty.jpg");
          }
        } else {
          // Thêm một file rỗng nếu không có ảnh
          const emptyBlob = new Blob([""], { type: "image/jpeg" });
          formData.append("imageFile", emptyBlob, "empty.jpg");
        }

        // Log the data being sent
        console.log("Sending data:", {
          id: teacherId,
          diaChi: this.editedAddress.DiaChi,
          Subject: formData.get("Subject"),
          UserId: userId,
          hasImageFile: formData.get("imageFile") !== null,
        });

        const response = await this.updateTeacher(formData);

        if (response) {
          this.userInfo = {
            ...this.userInfo,
            DiaChi: this.editedAddress.DiaChi,
          };
          this.isEditingAddress = false;
          alert("Cập nhật địa chỉ thành công!");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật địa chỉ:", error);
        if (error.response) {
          console.error("Chi tiết lỗi:", error.response.data);
        }
        alert("Có lỗi xảy ra khi cập nhật địa chỉ!");
      }
    },

    async saveProfessionalInfo() {
      try {
        const teacherId = this.teacherInfo.maGiaoVien;
        const userId = this.getUserID;
        const formData = new FormData();
        formData.append("maGiaoVien", teacherId);
        formData.append("UserId", userId); // Thêm UserId
        if (this.userInfo.Subject && Array.isArray(this.userInfo.Subject)) {
          formData.append("Subject", JSON.stringify(this.userInfo.Subject));
        } else {
          formData.append("Subject", JSON.stringify([])); // Gửi mảng rỗng nếu không có
        }
        if (this.userInfo.AnhHoSo) {
          try {
            const response = await fetch(this.userInfo.AnhHoSo);
            const blob = await response.blob();
            formData.append("imageFile", blob, "current-image.jpg");
          } catch (error) {
            console.warn("Không thể lấy ảnh hiện tại:", error);
            // Thêm một file rỗng để tránh lỗi validation
            const emptyBlob = new Blob([""], { type: "image/jpeg" });
            formData.append("imageFile", emptyBlob, "empty.jpg");
          }
        } else {
          // Thêm một file rỗng nếu không có ảnh
          const emptyBlob = new Blob([""], { type: "image/jpeg" });
          formData.append("imageFile", emptyBlob, "empty.jpg");
        }
        // Chỉ thêm các trường được chỉnh sửa
        if (this.editedProfessional.TrinhDoHocVan) {
          formData.append(
            "TrinhDoHocVan",
            this.editedProfessional.TrinhDoHocVan
          );
        }
        if (this.editedProfessional.ChuyenNganh) {
          formData.append("ChuyenNganh", this.editedProfessional.ChuyenNganh);
        }
        if (this.editedProfessional.KinhNghiem) {
          formData.append("KinhNghiem", this.editedProfessional.KinhNghiem);
        }
        if (this.editedProfessional.ChungChi) {
          formData.append("ChungChi", this.editedProfessional.ChungChi);
        }
        if (this.editedProfessional.TrangThai) {
          formData.append("TrangThai", this.editedProfessional.TrangThai);
        }

        const response = await this.updateTeacher(formData);
        if (response) {
          this.userInfo = {
            ...this.userInfo,
            ...this.editedProfessional,
          };
          this.isEditingProfessional = false;
          alert("Cập nhật thông tin chuyên môn thành công!");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin chuyên môn:", error);
        alert("Có lỗi xảy ra khi cập nhật thông tin chuyên môn!");
      }
    },

    startEditPersonal() {
      this.isEditingPersonal = true;
      this.editedPersonal = {
        HoTen: this.userInfo.HoTen,
        GioiTinh: this.userInfo.GioiTinh,
        NgaySinh: this.userInfo.NgaySinh,
        NoiSinh: this.userInfo.NoiSinh,
        Email: this.userInfo.Email,
        SDT: this.userInfo.SDT,
      };
    },

    startEditAddress() {
      this.isEditingAddress = true;
      this.editedAddress = { DiaChi: this.userInfo.DiaChi };
    },

    startEditProfessional() {
      this.isEditingProfessional = true;
      this.editedProfessional = {
        TrinhDoHocVan: this.userInfo.TrinhDoHocVan,
        ChuyenNganh: this.userInfo.ChuyenNganh,
        KinhNghiem: this.userInfo.KinhNghiem,
        ChungChi: this.userInfo.ChungChi,
        TrangThai: this.userInfo.TrangThai,
        lopChuNhiem: this.userInfo.lopChuNhiem,
        Subject: Array.isArray(this.userInfo.Subject)
          ? this.userInfo.Subject.join(", ")
          : "",
      };
    },

    async fetchUserData() {
      try {
        await this.getTeacher();
        const teacherData = this.teacherInfo;

        if (teacherData && teacherData.maGiaoVien) {
          this.userInfo = {
            MaGiaoVien: teacherData.maGiaoVien,
            HoTen: teacherData.hoTen || "",
            GioiTinh: teacherData.gioiTinh || "",
            NgaySinh: teacherData.ngaySinh || "",
            NoiSinh: teacherData.noiSinh || "",
            DiaChi: teacherData.diaChi || "",
            SDT: teacherData.sdt || "",
            Email: teacherData.email || "",
            TrinhDoHocVan: teacherData.trinhDoHocVan || "",
            ChuyenNganh: teacherData.chuyenNganh || "",
            KinhNghiem: teacherData.kinhNghiem || "",
            ChungChi: teacherData.chungChi || "",
            TrangThai: teacherData.trangThai || "",
            AnhHoSo: teacherData.anhHoSo || "",
            Subject: Array.isArray(teacherData.subject)
              ? teacherData.subject
              : [],
          };
          console.log("Đã cập nhật userInfo:", this.userInfo);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-page {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: all 0.3s ease;
    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }
  &__section {
    &--left {
      flex: 1;
      transition: transform 0.3s ease;
      &:hover {
        transform: translateY(-2px);
      }
    }
    &--right {
      width: 100%;
      @media (min-width: 1024px) {
        width: 33.3333%;
      }
    }
  }
}

.profile-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.5);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 1rem;

    h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #2d3748;
      font-weight: 600;
    }

    .edit-button {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      color: #4299e1;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(66, 153, 225, 0.1);
        color: #2b6cb0;
        transform: rotate(15deg);
      }
    }
  }

  .card-body {
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .info-item {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        border-radius: 0.5rem;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba(243, 244, 246, 0.5);
        }

        .info-label {
          font-weight: 600;
          color: #4a5568;
          width: 40%;
          font-size: 0.95rem;
        }

        .info-value {
          width: 55%;
          text-align: right;
          color: #2d3748;
        }

        input,
        select {
          width: 55%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
          }
        }
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        justify-content: flex-end;

        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;

          &:first-child {
            background-color: #4299e1;
            color: white;

            &:hover {
              background-color: #3182ce;
              transform: translateY(-1px);
            }
          }

          &:last-child {
            background-color: #e2e8f0;
            color: #4a5568;

            &:hover {
              background-color: #cbd5e0;
              transform: translateY(-1px);
            }
          }
        }
      }
    }
  }
}

.info-user-page {
  min-height: 100vh;
  background-color: #f3f4f6;

  .info-user-page_body {
    display: flex;
  }
}

.profile-container {
  max-width: 1200px;
  padding: 2.5rem;
  width: 80vw;
  height: 85vh;
  background: linear-gradient(135deg, #f6f8fb 0%, #e9f0f8 100%);
  overflow-y: auto;
  border-radius: 30px 0 0 30px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
  }
}

.profile-header {
  text-align: center;
  margin-bottom: 3.5rem;

  h1 {
    font-size: 2.75rem;
    color: #1a365d;
    margin-bottom: 0.75rem;
    font-weight: 700;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  p {
    color: #4a5568;
    font-size: 1.2rem;
    font-weight: 500;
  }
}

.profile-content {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: 300px 1fr;
  }
}
.info-grid {
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 8px;
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
    }

    .info-label {
      flex: 0 0 30%;
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }

    input,
    select {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      transition: border-color 0.3s ease;
      &:focus {
        border-color: #007bff;
        outline: none;
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 16px;

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
      &:first-child {
        background-color: #007bff;
        color: #fff;
        &:hover {
          background-color: #0056b3;
          transform: translateY(-2px);
        }
      }
      &:last-child {
        background-color: #f0f0f0;
        color: #333;
        &:hover {
          background-color: #e0e0e0;
          transform: translateY(-2px);
        }
      }
    }
  }
}
</style>
