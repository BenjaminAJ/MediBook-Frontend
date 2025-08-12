import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../services/Audit-logsapi';

type AuditLog = {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
};

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ user: '', action: '' });

  useEffect(() => {
    setLoading(true);
    getAuditLogs({
      ...(filters.user ? { user: filters.user } : {}),
      ...(filters.action ? { action: filters.action } : {}),
    })
      .then(res => setLogs(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="flex items-center justify-center from-gray-50 to-yellow-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-700">Audit Logs</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Filter by user/email"
            className="border px-3 py-2 rounded"
            value={filters.user}
            onChange={e => setFilters(f => ({ ...f, user: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Filter by action"
            className="border px-3 py-2 rounded"
            value={filters.action}
            onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}
          />
        </div>
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
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-2">{log.user}</td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2">{log.timestamp}</td>
                  <td className="px-4 py-2">{log.details || '-'}</td>
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
