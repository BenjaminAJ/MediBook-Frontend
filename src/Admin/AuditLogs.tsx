import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../services/Audit-logsapi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AuditLog = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  details?: Record<string, any>;
  timestamp: string;
};

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ userId: '', action: '' }); // Changed 'user' to 'userId'

  const auditActions = [
    "login", "logout", "register_user", "update_user", "delete_user",
    "create_appointment", "update_appointment", "cancel_appointment",
    "view_patient_data", "view_all_users", "view_audit_logs",
    "update_user_role", "update_system_config", "view_my_patient_appointments",
    "view_my_provider_appointments", "view_all_providers"
  ];

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await getAuditLogs({
        ...(filters.userId ? { userId: filters.userId } : {}),
        ...(filters.action ? { action: filters.action } : {}),
      });
      setLogs(Array.isArray(res.data) ? res.data : []);
      toast.success("Audit logs loaded successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  return (
    <div className="flex items-center justify-center from-gray-50 to-yellow-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-700">Audit Logs</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Filter by User ID" // Changed placeholder
            className="border px-3 py-2 rounded"
            value={filters.userId}
            onChange={e => setFilters(f => ({ ...f, userId: e.target.value }))} // Changed to userId
          />
          <select
            className="border px-3 py-2 rounded"
            value={filters.action}
            onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}
          >
            <option value="">Filter by action</option>
            {auditActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
        <ToastContainer />
        {loading ? (
          <div className="text-gray-500 py-8 text-center">Loading...</div>
        ) : logs.length === 0 ? (
          <p className="text-gray-600">No audit logs found.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="border-t">
                  <td className="px-4 py-2">{log.userId.name} ({log.userId.email})</td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2">{log.details ? JSON.stringify(log.details) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
