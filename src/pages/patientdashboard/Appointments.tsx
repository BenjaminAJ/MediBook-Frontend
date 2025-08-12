import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import D3Message from '../../components/D3Message';

type Appointment = {
  id: number;
  date: string;
  time: string;
  Provider: string; // changed back to Provider (capital P)
  reason: string;
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    date: '2025-08-15',
    time: '10:00',
    Provider: 'Acme Health Clinic', // changed back to Provider
    reason: 'Routine Checkup',
  },
];

// D3 Loader Component
const D3Loader: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    import('d3').then(d3 => {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove();
      const width = 60, height = 60, r = 20;
      const arc = d3.arc()
        .innerRadius(r - 6)
        .outerRadius(r)
        .startAngle(0)
        .endAngle(Math.PI * 1.5);

      svg.append('g')
        .attr('transform', `translate(${width/2},${height/2})`)
        .append('path')
        .attr('d', arc as any)
        .attr('fill', '#2563eb')
        .attr('opacity', 0.8)
        .attr('id', 'd3-loader-arc');

      function animate() {
        svg.select('#d3-loader-arc')
          .transition()
          .duration(900)
          .attrTween('transform', () => d3.interpolateString('rotate(0)', 'rotate(360)'))
          .on('end', animate);
      }
      animate();
    });
  }, []);

  return (
    <svg ref={ref} width={60} height={60} />
  );
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Omit<Appointment, 'id'>>({
    date: '',
    time: '',
    Provider: '',
    reason: '',
  });

  const resetForm = () => {
    setForm({ date: '', time: '', Provider: '', reason: '' });
    setEditing(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.Provider || !form.reason) {
      setMessage({ type: 'error', text: 'Please fill all fields.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (editing) {
        setAppointments(apps =>
          apps.map(app =>
            app.id === editing.id ? { ...editing, ...form } : app
          )
        );
        setMessage({ type: 'success', text: 'Appointment updated.' });
      } else {
        setAppointments(apps => [
          ...apps,
          { ...form, id: Date.now() },
        ]);
        setMessage({ type: 'success', text: 'Appointment booked.' });
      }
      setShowForm(false);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (app: Appointment) => {
    setEditing(app);
    setForm({
      date: app.date,
      time: app.time,
      Provider: app.Provider,
      reason: app.reason,
    });
    setShowForm(true);
  };

  const handleCancel = (id: number) => {
    setLoading(true);
    setTimeout(() => {
      setAppointments(apps => apps.filter(app => app.id !== id));
      setMessage({ type: 'success', text: 'Appointment cancelled.' });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <D3Loader />
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Appointments</h2>
        <button
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          onClick={() => {
            setShowForm(true);
            resetForm();
          }}
        >
          <PlusCircle size={20} className="mr-2" />
          Book Appointment
        </button>
      </div>
      {message && (
        <D3Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      {/* Appointment Form */}
      {showForm && (
        <form
          onSubmit={handleBook}
          className="bg-blue-50 rounded-xl p-6 mb-8 shadow max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleFormChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Provider</label>
              <input
                type="text"
                name="Provider"
                value={form.Provider}
                onChange={handleFormChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Reason</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleFormChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition"
            >
              {editing ? 'Update' : 'Book'}
            </button>
          </div>
        </form>
      )}
      {/* Appointment List */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">Your Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.id} className="border-t">
                  <td className="px-4 py-2">{app.date}</td>
                  <td className="px-4 py-2">{app.time}</td>
                  <td className="px-4 py-2">{app.Provider}</td>
                  <td className="px-4 py-2">{app.reason}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 hover:text-white bg-blue-100 hover:bg-blue-700 rounded transition mr-2"
                      title="Edit"
                      onClick={() => handleEdit(app)}
                    >
                      <Pencil size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 hover:text-white bg-red-100 hover:bg-red-700 rounded transition"
                      title="Cancel"
                      onClick={() => handleCancel(app.id)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Cancel
                    </button>
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

export default Appointments;
