import React, { useState } from "react";
import { ListChecks } from "lucide-react";

// Demo data for provider appointments
type ProviderAppointment = {
  id: number;
  patient: string;
  date: string;
  time: string;
  reason: string;
  status: "upcoming" | "completed" | "cancelled";
};

const demoAppointments: ProviderAppointment[] = [
  {
    id: 1,
    patient: "Jane Doe",
    date: "2025-08-15",
    time: "10:00",
    reason: "Routine Checkup",
    status: "upcoming",
  },
  {
    id: 2,
    patient: "John Smith",
    date: "2025-08-10",
    time: "14:00",
    reason: "Consultation",
    status: "completed",
  },
];

const ViewAppointments: React.FC = () => {
  const [appointments] = useState<ProviderAppointment[]>(demoAppointments);

  return (
    <div className="w-full mb-20">
      <div className="flex items-center mb-6">
        <ListChecks className="text-blue-700 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-blue-700">View Appointments</h2>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Patient</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="px-4 py-2">{app.patient}</td>
                  <td className="px-4 py-2">{app.date}</td>
                  <td className="px-4 py-2">{app.time}</td>
                  <td className="px-4 py-2">{app.reason}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          app.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : app.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewAppointments;
