import React, { useState, useEffect } from "react";
import { ListChecks } from "lucide-react";
import { getProviderAppointments, cancelAppointment, Appointment as ApiAppointment } from "../../services/Appointmentapi";

const ViewAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Replace with actual providerId logic as needed
  const providerId = localStorage.getItem("providerId") || "1";

  useEffect(() => {
    setLoading(true);
    getProviderAppointments(providerId)
      .then(res => {
        setAppointments(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setMessage("Failed to load appointments."))
      .finally(() => setLoading(false));
  }, [providerId]);

  const handleCancel = (id: number) => {
    setLoading(true);
    cancelAppointment(id)
      .then(() => {
        setMessage("Appointment cancelled.");
        // Refresh list
        return getProviderAppointments(providerId);
      })
      .then(res => {
        setAppointments(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setMessage("Failed to cancel appointment."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full mb-20">
      <div className="flex items-center mb-6">
        <ListChecks className="text-blue-700 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-blue-700">View Appointments</h2>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : appointments.length === 0 ? (
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
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="px-4 py-2">{app.patientId}</td>
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
                      {app.status
                        ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                        : "Upcoming"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {app.status !== "cancelled" && (
                      <button
                        className="px-3 py-1 text-xs font-medium text-red-700 hover:text-white bg-red-100 hover:bg-red-700 rounded transition"
                        onClick={() => handleCancel(app.id!)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {message && (
          <div className="mt-4 text-center text-sm text-blue-700 font-semibold">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ViewAppointments;
