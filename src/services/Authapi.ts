import api from './api';

// Register a new user
export const register = (data: Record<string, any>) => {
  return api.post('/auth/register', data);
};

// Login user and get token
export const login = (data: { email: string; password: string }) => {
  return api.post('/auth/login', data);
};
