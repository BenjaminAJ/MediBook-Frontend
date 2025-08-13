import api from './api';

// Get authenticated user's profile
export const getAuthenticatedUserProfile = () => {
  return api.get(`/users/profile`);
};

// Get any user profile by ID (Admin only)
export const getUserProfileById = (id: string | number) => {
  return api.get(`/users/${id}`);
};

// Update user profile by ID
export const updateUserProfile = (id: string | number, data: Record<string, any>) => {
  return api.put(`/users/${id}`, data);
};
