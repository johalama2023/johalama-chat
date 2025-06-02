import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : import.meta.env.VITE_API_BASE_URL || "/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Ejemplo: interceptor global para manejar errores o logs
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Aquí podrías manejar errores comunes, p.ej:
    if (error.response?.status === 401) {
      // manejar sesión expirada, redirigir al login, etc.
    }
    return Promise.reject(error);
  }
);
