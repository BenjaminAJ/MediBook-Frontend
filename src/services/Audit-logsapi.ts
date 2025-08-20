import api from './api';

// Retrieve and filter audit logs (POST /audit-logs)
export const getAuditLogs = (filters?: Record<string, any>) => {
  return api.post('/admin/audit-logs', filters || {});
};
