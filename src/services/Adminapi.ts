import api from './api';

// List all users
export const getAllUsers = () => {
  return api.get('/admin/users');
};

// Delete a user by ID
export const deleteUser = (id: string | number) => {
  return api.delete(`/admin/users/${id}`);
};

// Update user role
export const updateUserRole = (id: string | number, role: string) => {
  return api.put(`/admin/users/${id}/role`, { role });
};

// Retrieve audit logs (POST)
export const getAuditLogs = (filters?: Record<string, any>) => {
  return api.post('/admin/audit-logs', filters || {});
};
