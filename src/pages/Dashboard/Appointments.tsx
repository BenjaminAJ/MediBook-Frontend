import React from 'react';

const Appointments: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Appointments</h2>
        {/* Appointment list and booking functionality go here */}
        <p className="text-gray-600">This is where users can view and manage their appointments.</p>
      </div>
    </div>
  );
};

export default Appointments;
