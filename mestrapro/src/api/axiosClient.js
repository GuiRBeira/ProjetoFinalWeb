// Em: src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Este é o interceptor. Ele "intercepta" toda requisição antes de ser enviada.
axiosClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('accessToken');
    // Se o token existir, adiciona ao cabeçalho Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Faz alguma coisa com o erro da requisição
    return Promise.reject(error);
  }
);

export default axiosClient;