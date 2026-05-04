// services/auth.js
import api from './api';

export const loginUser = async (mobile, password) => {
  const response = await api.post('/auth/login', { mobile, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const uploadKYC = async (aadhaarUri, panUri) => {
  const formData = new FormData();

  formData.append('aadhaar', {
    uri: aadhaarUri,
    type: 'image/jpeg',
    name: 'aadhaar.jpg',
  });

  formData.append('pan', {
    uri: panUri,
    type: 'image/jpeg',
    name: 'pan.jpg',
  });

  const response = await api.post('/kyc/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const submitSupportTicket = async (subject, message) => {
  const response = await api.post('/support/ticket', { subject, message });
  return response.data;
};
