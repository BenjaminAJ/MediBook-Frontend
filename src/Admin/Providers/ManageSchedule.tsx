import React from "react";
import { CalendarDays } from "lucide-react";

const ManageSchedule: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <CalendarDays className="text-blue-700 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-blue-700">Manage Schedule</h2>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {/* Schedule management UI goes here */}
        <p className="text-gray-600">
          Here you can manage your schedule. (Feature coming soon)
        </p>
      </div>
    </div>
  );
};

export default ManageSchedule;
