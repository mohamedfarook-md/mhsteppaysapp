// // services/api.js
// import axios from 'axios';
// import { BASE_URL } from '../constants/config';
// import { getToken, clearStorage } from '../utils/storage';

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor - attach JWT token
// api.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor - handle 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       await clearStorage();
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';
import { BASE_URL } from '../constants/config';
import { getToken, clearStorage } from '../utils/storage';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API:", config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearStorage();

      Alert.alert(
        "Session Expired",
        "Please login again"
      );
    }

    return Promise.reject(error);
  }
);

export default api;