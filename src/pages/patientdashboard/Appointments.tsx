import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import D3Message from "../../components/D3Message";
import {
  getMyAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  Appointment as ApiAppointment,
} from "../../services/Appointmentapi";
import { getProviders } from "../../services/Userapi";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate"; // Import date formatting utilities

// helper: convert ISO (or any parseable date) to "YYYY-MM-DDTHH:MM" for datetime-local
const toDateTimeLocal = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

// D3 Loader Component
const D3Loader: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    import("d3").then((d3) => {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      const width = 60,
        height = 60,
        r = 20;
      const arc = d3
        .arc()
        .innerRadius(r - 6)
        .outerRadius(r)
        .startAngle(0)
        .endAngle(Math.PI * 1.5);

      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .append("path")
        .attr("d", arc as any)
        .attr("fill", "#2563eb")
        .attr("opacity", 0.8)
        .attr("id", "d3-loader-arc");

      function animate() {
        svg
          .select("#d3-loader-arc")
          .transition()
          .duration(900)
          .attrTween("transform", () =>
            d3.interpolateString("rotate(0)", "rotate(360)")
          )
          .on("end", animate);
      }
      animate();
    });
  }, []);

  return <svg ref={ref} width={60} height={60} />;
};

type Appointment = {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
  };
  providerId: {
    _id: string;
    name: string; // Derived from providerInfo.clinicName
    specialization: string; // From providerInfo.specialization
  };
  dateTime: string;
  status: string;
  notes?: string;
};

type Provider = {
  id: string;
  name: string; // Assuming providers have a name
  email: string;
  clinicName: string;
  // Add other provider properties as needed
};

const Appointments: React.FC = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]); // State to store providers
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

type AppointmentForm = {
  dateTime: string;
  providerId: string;
  notes?: string;
  patientId?: string; // For admin only
};

const [form, setForm] = useState<AppointmentForm>({
  dateTime: "",
  providerId: "",
  notes: "",
});

  // Fetch appointments and providers on mount
  useEffect(() => {
    setLoading(true);
    getMyAppointments() 
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAppointments(
          data.map((a: ApiAppointment) => ({
            _id: a._id!, // Use _id from API response
            patientId: typeof a.patientId === 'string'
              ? { _id: a.patientId, name: '', email: '' }
              : a.patientId!,
            providerId: typeof a.providerId === 'string'
              ? { _id: a.providerId, name: '', specialization: '' }
              : {
                  _id: a.providerId._id,
                  name: a.providerId.providerInfo?.clinicName || '',
                  specialization: a.providerId.providerInfo?.specialization || '',
                },
            dateTime: a.dateTime,
            status: a.status!,
            notes: a.notes,
          }))
        );
      })
      .catch(() =>
        setMessage({ type: "error", text: "Failed to load appointments." })
      )
      .finally(() => setLoading(false));

    getProviders()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];        
        setProviders(data.map((p: any) => ({ id: p._id, name: p.name || p.email, email: p.email, clinicName: p.providerInfo.clinicName }))); // Include email in the mapping
      })
      .catch((err) => {
        console.log(err);
        
        setMessage({ type: "error", text: "Failed to load providers." });
      });
    // eslint-disable-next-line
  }, []);

  const resetForm = () => {
    setForm({ dateTime: "", providerId: "", notes: "" });
    setEditing(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> // Added HTMLSelectElement
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dateTime || !form.providerId) { // Removed reason from required fields
      setMessage({ type: "error", text: "Please fill all required fields (Date & Time, Provider)." });
      return;
    }
    setLoading(true);

    const fullDateTime = new Date(form.dateTime).toISOString();

    const apiData: Omit<ApiAppointment, "_id"> = { // Changed from "id" to "_id"
      dateTime: fullDateTime,
      patientId: user?.role === 'admin' ? (form as any).patientId : user?.id,
      providerId: form.providerId,
      status: "pending", // Default status to pending
      notes: form.notes,
    };
    const action = editing
      ? updateAppointment(editing._id!, apiData) // Changed editing.id to editing._id!
      : createAppointment(apiData);

    action
      .then(() => {
        setMessage({
          type: "success",
          text: editing ? "Appointment updated." : "Appointment booked.",
        });
        // Refresh appointments
        return getMyAppointments(); // Changed to getMyAppointments
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAppointments(
          data.map((a: ApiAppointment) => ({
            _id: a._id!,
            patientId: typeof a.patientId === 'string'
              ? { _id: a.patientId, name: '', email: '' }
              : a.patientId!,
            providerId: typeof a.providerId === 'string'
              ? { _id: a.providerId, name: '', specialization: '' }
              : {
                  _id: a.providerId._id,
                  name: a.providerId.providerInfo?.clinicName || '',
                  specialization: a.providerId.providerInfo?.specialization || '',
                },
            dateTime: a.dateTime,
            status: a.status!,
            notes: a.notes,
          }))
        );
      })
      .catch(() =>
        setMessage({
          type: "error",
          text: editing
            ? "Failed to update appointment."
            : "Failed to book appointment.",
        })
      )
      .finally(() => {
        setShowForm(false);
        resetForm();
        setLoading(false);
      });
  };

  const handleEdit = (app: Appointment) => {
    setEditing(app);
    setForm({
      dateTime: toDateTimeLocal(app.dateTime),
      providerId: app.providerId._id, // Use _id for providerId
      notes: app.notes,
    });
    setShowForm(true);
  };

  const handleCancel = (id: string) => {
    setLoading(true);
    cancelAppointment(id)
      .then(() => {
        setMessage({ type: "success", text: "Appointment cancelled." });
        return getMyAppointments();
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAppointments(
          data.map((a: ApiAppointment) => ({
            _id: a._id!,
            patientId: typeof a.patientId === 'string'
              ? { _id: a.patientId, name: '', email: '' }
              : a.patientId!,
            providerId: typeof a.providerId === 'string'
              ? { _id: a.providerId, name: '', specialization: '' }
              : {
                  _id: a.providerId._id,
                  name: a.providerId.providerInfo?.clinicName || '',
                  specialization: a.providerId.providerInfo?.specialization || '',
                },
            dateTime: a.dateTime,
            status: a.status!,
            notes: a.notes,
          }))
        );
      })
      .catch(() =>
        setMessage({ type: "error", text: "Failed to cancel appointment." })
      )
      .finally(() => setLoading(false));
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
              <label className="block mb-1 font-medium text-gray-700">
                Date and Time
              </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={form.dateTime || ''}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  required
                />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Provider
              </label>
              <select
                name="providerId"
                value={form.providerId}
                onChange={handleFormChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select a Provider</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.clinicName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={form.notes || ''}
                onChange={handleFormChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
            </div>
            {user?.role === 'admin' && (
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Patient ID (Admin Only)
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={(form as any).patientId || ''}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  placeholder="Enter Patient ID"
                />
              </div>
            )}
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
              {editing ? "Update" : "Book"}
            </button>
          </div>
        </form>
      )}
      {/* Appointment List */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">
          Your Appointments
        </h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Notes</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id} className="border-t">
                  <td className="px-4 py-2">{formatDate(app.dateTime)}</td>
                  <td className="px-4 py-2">
                    {app.providerId.name} ({app.providerId.specialization})
                  </td>
                  <td className="px-4 py-2 capitalize">{app.status}</td>
                  <td className="px-4 py-2">{app.notes || '-'}</td>
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
                      onClick={() => handleCancel(app._id)}
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
