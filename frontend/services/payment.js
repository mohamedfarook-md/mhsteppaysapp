// services/payment.js
import api from './api';

export const getMerchantInfo = async (merchantId) => {
  const response = await api.get(`/public/${merchantId}`);
  return response.data;
};

export const initiatePayment = async (paymentData) => {
  const response = await api.post('/payment/initiate', paymentData);
  return response.data;
};

export const getTransactionHistory = async () => {
  const response = await api.get('/transactions/user');
  return response.data;
};

export const initiateUPI = (data) =>
  api.post('/payment/upi-initiate', data);

export const markUPISuccess = (data) =>
  api.post('/payment/upi-success', data);
