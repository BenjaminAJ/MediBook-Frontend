import React from 'react';

const UserManagement: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">User Management</h2>
        {/* User list, search, and management actions go here */}
        <p className="text-gray-600">Admins can view, edit, and manage users here.</p>
      </div>
    </div>
  );
};

export default UserManagement;
