import React, { useState, useEffect } from "react";
import { CalendarCheck2 } from "lucide-react";
import { getPatientAppointments, Appointment as ApiAppointment } from "../../services/Appointmentapi";

const History: React.FC = () => {
  const [history, setHistory] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace with actual patientId logic as needed
  const patientId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    setLoading(true);
    getPatientAppointments(patientId)
      .then(res => {
        setHistory(Array.isArray(res.data) ? res.data : []);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return (
    <div className="w-full mb-20">
      <div className="flex items-center mb-5">
        <CalendarCheck2 className="text-yellow-700 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-yellow-700">
          Appointment History
        </h2>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No appointment history found.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Doctor</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.time}</td>
                  <td className="px-4 py-2">{item.doctor}</td>
                  <td className="px-4 py-2">{item.reason}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            item.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : item.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                    >
                      {item.status
                        ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                        : "Scheduled"}
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

export default History;