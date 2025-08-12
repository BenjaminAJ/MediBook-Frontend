import api from './api';

// Get user profile by ID
export const getUserProfile = (id: string | number) => {
  return api.get(`/users/${id}`);
};

// Update user profile by ID
export const updateUserProfile = (id: string | number, data: Record<string, any>) => {
  return api.put(`/users/${id}`, data);
};
