import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // ou seu IP local
});

export const loginUser = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const signupUser = async (email: string, password: string) => {
  const res = await api.post('/auth/signup', { email, password });
  return res.data;
};