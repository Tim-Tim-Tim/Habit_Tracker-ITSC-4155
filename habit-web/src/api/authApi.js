// src/api/authApi.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  // Backend expects OAuth2PasswordRequestForm: "username" + "password"
  login: async (usernameOrEmail, password) => {
    const formData = new FormData();
    formData.append("username", usernameOrEmail); // we use email as username
    formData.append("password", password);

    const res = await api.post("/token", formData);
    return res.data; // { access_token, token_type }
  },

  signup: (name, email, password) =>
    api.post("/register", {
      username: email, 
      email,
      password,
    }),

  me: () => api.get("/users/me"),
};
