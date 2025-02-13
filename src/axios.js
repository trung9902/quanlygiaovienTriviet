// src/axios.js
import axios from "axios";

// Tạo instance axios mà không cần headers và timeout là 1 giờ (3600000ms)
const instance = axios.create({
  baseURL: "https://localhost:7139", // URL của backend
  timeout: 3600000, // Timeout là 1 giờ (3600000ms)
});

// Interceptor cho yêu cầu trước khi gửi
instance.interceptors.request.use(
  (config) => {
    console.log("Gửi yêu cầu: ", config); // Log thông tin yêu cầu
    return config;
  },
  (error) => {
    console.log("Lỗi yêu cầu: ", error);
    return Promise.reject(error);
  }
);

// Interceptor cho phản hồi sau khi nhận được
instance.interceptors.response.use(
  (response) => {
    console.log("Nhận phản hồi: ", response); // Log phản hồi
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("Lỗi từ API: ", error.response.data); // Thông tin lỗi chi tiết từ API
      console.log("Mã lỗi: ", error.response.status); // Mã trạng thái lỗi (ví dụ: 400, 500)
    } else {
      console.log("Lỗi không phải từ API: ", error.message); // Nếu lỗi không đến từ phản hồi API
    }
    return Promise.reject(error);
  }
);

export default instance;
