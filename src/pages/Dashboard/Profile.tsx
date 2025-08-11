import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Profile Management</h2>
        {/* Profile details and edit form go here */}
        <p className="text-gray-600">This is where users can view and update their profile information.</p>
      </div>
    </div>
  );
};

export default Profile;
