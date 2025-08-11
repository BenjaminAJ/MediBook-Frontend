import React, { useState } from 'react';
import { CalendarCheck2 } from 'lucide-react';

// Demo appointment history data
type AppointmentHistory = {
  id: number;
  date: string;
  time: string;
  doctor: string;
  reason: string;
  status: 'completed' | 'cancelled';
};

const demoHistory: AppointmentHistory[] = [
  {
    id: 1,
    date: '2025-08-01',
    time: '09:00',
    doctor: 'Dr. John Smith',
    reason: 'Routine Checkup',
    status: 'completed',
  },
  {
    id: 2,
    date: '2025-07-10',
    time: '14:00',
    doctor: 'Dr. Jane Doe',
    reason: 'Consultation',
    status: 'cancelled',
  },
];

const History: React.FC = () => {
  const [history] = useState<AppointmentHistory[]>(demoHistory);

  return (
    <div className="w-full mb-20">
      <div className="flex items-center mb-5">
        <CalendarCheck2 className="text-yellow-700 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-yellow-700">Appointment History</h2>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        {history.length === 0 ? (
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
              {history.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.time}</td>
                  <td className="px-4 py-2">{item.doctor}</td>
                  <td className="px-4 py-2">{item.reason}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                          ${item.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-700'}`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
