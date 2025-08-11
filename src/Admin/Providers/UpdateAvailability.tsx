import React from "react";
import { Clock } from "lucide-react";

const UpdateAvailability: React.FC = () => {
  return (
    <div className="w-full mb-20">
      <div className="flex items-center mb-6">
        <Clock className="text-blue-700 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-blue-700">Update Availability</h2>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {/* Availability update UI goes here */}
        <p className="text-gray-600">
          Here you can update your availability. (Feature coming soon)
        </p>
      </div>
    </div>
  );
};

export default UpdateAvailability;
