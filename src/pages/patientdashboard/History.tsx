import React from 'react';

const History: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-green-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-700">History</h2>
        {/* Medical history and past appointments go here */}
        <p className="text-gray-600">This is where users can view their medical and appointment history.</p>
      </div>
    </div>
  );
};

export default History;
