// lib/api/auth.ts
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  gender: string;
  school_name: string;
}) => {
  return axios.post(`${API_BASE}/register`, data);
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  return axios.post(`${API_BASE}/login`, data, { withCredentials: true });
};
