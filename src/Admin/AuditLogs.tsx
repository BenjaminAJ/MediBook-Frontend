import React from 'react';

const AuditLogs: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-yellow-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-700">Audit Logs</h2>
        {/* Audit log table and filters go here */}
        <p className="text-gray-600">Admins can review system activity and audit logs here.</p>
      </div>
    </div>
  );
};

export default AuditLogs;
