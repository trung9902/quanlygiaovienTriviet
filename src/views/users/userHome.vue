<template>
  <div
    class="home-container"
    style="background-color: #223771"
    :style="{ width: adminContentWidth }"
  >
    <menuTopUser />
    <div class="ContentHome">
      <NavbarUser />
      <div class="content-container">
        <div class="main-content">
          <div class="welcome-section">
            <h1>Hệ Thống Quản Lý Giáo Viên</h1>
            <p>Chào mừng đến với hệ thống quản lý thông tin giáo viên</p>
          </div>
        </div>
        <div class="feature-container">
          <h3 class="title">Chức năng</h3>
          <div class="feature-list">
            <router-link to="/infoUser" class="feature-item">
              <div class="icon-wrapper">
                <i class="fas fa-home"></i>
              </div>
              <span>hồ sơ cá nhân</span>
            </router-link>
            <router-link to="/topicBankUser" class="feature-item">
              <div class="icon-wrapper">
                <i class="fas fa-user"></i>
              </div>
              <span>ngân hàng đề</span>
            </router-link>
            <router-link to="/lichGiangDay" class="feature-item">
              <div class="icon-wrapper">
                <i class="fas fa-cog"></i>
              </div>
              <span>lịch giảng dạy</span>
            </router-link>
          </div>
        </div>
        <div class="news-activities">
          <div
            v-for="(news, index) in allNews"
            :key="index"
            class="newUser-box"
          >
            <img
              :src="`${baseURL}${news.thumbnail}`"
              alt="Logo"
              class="img-news"
              @click="openModal(news)"
            />
            <div class="contentNews-box" @click="openModal(news)">
              <h3 class="title">{{ news.title }}</h3>
              <p class="date">{{ formatDate(news.publishedDate) }}</p>
              <p class="content">{{ news.content }}</p>
              <a
                v-if="news.DocumentPath"
                :href="`${baseURL}${news.DocumentPath}`"
                target="_blank"
                class="document-link"
              >
                <i class="el-icon-document"></i>
                Tài liệu đính kèm
              </a>
              <button @click="viewDetails(news)" class="view-details-button">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h3>{{ selectedNews.title }}</h3>
            <p>{{ selectedNews.content }}</p>
            <button
              @click="viewDetails(selectedNews)"
              class="view-details-button"
            >
              Xem chi tiết tài liệu
            </button>
            <!-- Khu vực bình luận -->
            <div class="comments-section">
              <h4>Bình luận</h4>
              <textarea
                v-model="newComment"
                placeholder="Viết bình luận..."
              ></textarea>
              <button @click="addComment">Gửi</button>
              <ul>
                <li
                  v-for="(comment, index) in selectedNews.comments"
                  :key="index"
                >
                  <strong>{{ comment.author }}:</strong> {{ comment.content }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import NavbarUser from "@/components/USER/navbarUser.vue";
import menuTopUser from "@/components/USER/menuTopUser.vue";
import { toRaw } from "vue";

export default {
  name: "UserHome",
  data() {
    return {
      showModal: false,
      selectedNews: {},
      newComment: "",
      baseURL: "https://localhost:7139", // Add baseURL
      loading: false,
    };
  },
  components: {
    NavbarUser,
    menuTopUser,
  },
  computed: {
    ...mapGetters(["allNews", "allComment"]),
  },
  methods: {
    ...mapActions(["getNews", "getCommentByNews", "addComment"]),
    async openModal(news) {
      this.selectedNews = news;
      this.showModal = true;
      await this.fetchComments(news.id);
    },
    closeModal() {
      this.showModal = false;
    },
    async addComment() {
      console.log("Adding comment:", this.allComment);
      if (this.newComment.trim()) {
        await this.$store.dispatch("addComment", {
          newsId: this.selectedNews.id,
          content: this.newComment.trim(),
          author: this.$store.getters.getUserName, // Thay thế bằng tên tác giả thực tế nếu có
        });
        this.newComment = "";
        await this.fetchComments(this.selectedNews.id);
      }
    },
    async fetchComments(newsId) {
      console.log("Adding comment:", this.allComment(newsId));
      try {
        const comments = await this.$store.dispatch("getCommentByNews", newsId);
        this.selectedNews.comments = comments;
        this.selectedNews.comments = this.allComment(newsId);
      } catch (error) {
        console.error("Lỗi khi tải bình luận:", error);
      }
    },
    viewDetails(news) {
      const rawNews = toRaw(news);
      console.log("View details:", rawNews);
      console.log(rawNews.documentPath);
      if (rawNews.documentPath) {
        const documentURL = `${this.baseURL}${rawNews.documentPath}`;
        window.open(documentURL, "_blank");
      } else {
        alert("No document available");
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    async fetchNews() {
      this.loading = true;
      try {
        await this.$store.dispatch("getNews");
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
      }
      this.loading = false;
    },
  },
  mounted() {
    this.fetchNews(); // Call fetchNews when component mounts
  },
};
</script>
<style scoped lang="scss">
.home-container {
  height: 100%;
}
.content-container {
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 85vh;
  //   width: 100%;
  background: linear-gradient(to right, var(--light-gray), var(--light-blue));
  overflow-y: scroll;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  border: 1px solid #000;
}
.ContentHome {
  display: flex;
}

.sidebar {
  width: 260px;
  background-color: #2c3e50;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  padding-top: 20px;
  transition: all 0.3s ease-in-out;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.custom-sidebar .el-menu-item,
.custom-sidebar .el-submenu__title {
  font-size: 16px;
  font-weight: 500;
  padding: 15px 20px;
  transition: background 0.3s;
}

.custom-sidebar .el-menu-item:hover,
.custom-sidebar .el-submenu__title:hover {
  background-color: #34495e !important;
}

.main-content {
  padding: 2rem;
  margin: 0;
}

.welcome-section {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1976d2 0%, #64b5f6 100%);
  color: white;
  border-radius: 8px;
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  text-align: center;
}

.feature-card i {
  font-size: 3rem;
  color: #1976d2;
  margin-bottom: 1rem;
}

.quick-stats {
  margin-top: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.stat-item i {
  font-size: 2.5rem;
  color: #1976d2;
  margin-right: 1rem;
}

.el-card {
  transition: transform 0.3s;
}

.el-card:hover {
  transform: translateY(-5px);
}

.news-activities {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  padding: 20px;

  .newUser-box {
    width: 24vw;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    transition: transform 0.3s ease;
    border: 1px solid #e5e7eb;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    }

    .img-news {
      width: 100%;
      object-fit: cover;
      margin: 0 auto 5px;
      display: block;
      border-radius: 10px;
      padding: 5px;
      height: 200px;
      object-fit: cover;
    }

    .contentNews-box {
      text-align: left;
      padding-left: 10px;
      padding-right: 10px;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
      }

      .date {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
      }

      .content {
        font-size: 14px;
        color: #444;
        line-height: 1.4;
        margin-bottom: 12px;
      }

      .document-link {
        display: flex;
        justify-content: center;
        color: #007bff;
        font-size: 14px;
        text-decoration: none;
        margin-bottom: 10px;
        gap: 5px;

        i {
          font-size: 16px;
        }

        &:hover {
          text-decoration: underline;
        }
      }

      .view-details-button {
        width: 100%;
        background: #007bff;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        border: none;
        padding: 8px 0;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s ease;

        &:hover {
          background: #0056b3;
        }
      }
    }
  }
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal-content {
    background: #ffffff;
    width: 90%;
    max-width: 500px;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    animation: fadeIn 0.3s ease-in-out;

    h3 {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 12px;
    }

    p {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    .close {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      transition: 0.3s;

      &:hover {
        color: red;
      }
    }

    .comments-section {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      text-align: left;
      margin-top: 15px;

      h4 {
        font-size: 18px;
        font-weight: bold;
        color: #444;
        margin-bottom: 10px;
      }

      textarea {
        width: 100%;
        height: 80px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 14px;
        resize: none;
        outline: none;
        transition: border 0.3s ease;

        &:focus {
          border-color: #007bff;
        }
      }

      button {
        width: 100%;
        margin-top: 10px;
        padding: 10px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s ease;

        &:hover {
          background: #0056b3;
        }
      }

      ul {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        max-height: 150px;
        overflow-y: auto;

        li {
          background: #ffffff;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 5px;
          font-size: 14px;
          color: #333;
          border-left: 4px solid #007bff;
        }
      }
    }
  }
}

/* Animation mở modal */
@keyframes fadeIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.view-details-button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #004085;
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
}
.feature-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  margin: 0 30px;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #222;
    margin: 0 30px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    .icon-wrapper {
      background: #eaf2ff;
      padding: 10px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      margin-bottom: 5px;
      transition: background-color 0.3s ease;
      margin: 5px;
    }

    img {
      width: 24px;
      height: 24px;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
.feature-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin: 0 30px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .title {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
    color: #2d3748;
  }

  .feature-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
    color: #2d3748;
    padding: 10px;
    border-radius: 8px;
    background: #f7fafc;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: #ffffff;
    }

    .icon-wrapper {
      background: linear-gradient(135deg, #67b26f, #4ca2cd);
      color: #fff;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      font-size: 24px;
      transition: background 0.3s ease;
    }
  }
}
</style>
