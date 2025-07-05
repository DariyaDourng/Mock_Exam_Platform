import axios from "axios";

// Base URL setup (optional)
axios.defaults.baseURL = "http://localhost:8000/api";

const TOKEN_KEY = "token";

export const login = async (email: string, password: string) => {
  const response = await axios.post("/login", { email, password });

  const token = response.data.token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common["Authorization"];
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setTokenHeader = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};
