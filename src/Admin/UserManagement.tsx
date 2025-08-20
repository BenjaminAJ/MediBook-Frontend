import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, ShieldCheck } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllUsers, deleteUser, updateUserRole } from '../services/Adminapi';

type User = {
  _id: string;
  role: 'patient' | 'provider' | 'admin';
  email: string;
  name: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  medicalInfo?: {
    dateOfBirth: string;
    bloodType: string;
    allergies: string[];
    medicalHistory: string[];
  };
  providerInfo?: {
    specialization: string;
    clinicName: string;
    licenseNumber: string;
  };
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{
    type: 'delete' | 'role';
    user: User | null;
  }>({ type: 'delete', user: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();      
      setUsers(Array.isArray(res.data.data) ? res.data.data : []);
      toast.success("Users loaded successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (user: User) => {
    setConfirm({ type: 'delete', user });
  };

  const handleToggleRole = (user: User) => {
    setConfirm({ type: 'role', user });
  };

  const confirmDelete = async () => {
    if (confirm.user) {
      try {
        await deleteUser(confirm.user._id);
        toast.success(`User "${confirm.user.name}" deleted.`);
        fetchUsers(); // Re-fetch users after deletion
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete user.');
      }
    }
    setConfirm({ type: 'delete', user: null });
  };

  const confirmRole = async () => {
    if (confirm.user) {
      const newRole = confirm.user.role === 'admin' ? 'patient' : 'admin'; // Assuming toggle between admin and patient for simplicity
      try {
        await updateUserRole(confirm.user._id, newRole);
        toast.success(`User "${confirm.user.name}" is now ${newRole === 'admin' ? 'an admin' : 'a patient'}.`);
        fetchUsers(); // Re-fetch users after role update
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to update user role.');
      }
    }
    setConfirm({ type: 'role', user: null });
  };

  return (
    <div className="min-h-0 h-full bg-gradient-to-tr from-slate-100 to-blue-50 flex flex-col">
      <header className="w-full bg-white shadow flex items-center px-8 py-6 mb-6">
        <span className="bg-blue-200 rounded-full p-2 mr-4">
          <ShieldCheck className="text-blue-700" size={32} />
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight">
          User Management
        </h1>
      </header>
      <main className="flex-1 flex flex-col items-center w-full">
        <section className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-x-auto">
          <ToastContainer />
          {loading ? (
            <div className="text-center py-16 text-gray-500 text-lg">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-lg">No users found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-5 text-left text-base font-bold text-blue-900 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-5 text-left text-base font-bold text-blue-900 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-5 text-left text-base font-bold text-blue-900 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-5 text-center text-base font-bold text-blue-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-blue-100/40 transition">
                    <td className="px-6 py-5 border-b border-gray-100 text-lg font-semibold text-gray-800">{user.name}</td>
                    <td className="px-6 py-5 border-b border-gray-100 text-lg text-gray-700">{user.email}</td>
                    <td className="px-6 py-5 border-b border-gray-100 capitalize text-lg">
                      <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-bold shadow-sm
                        ${user.role === 'admin'
                          ? 'bg-yellow-200 text-yellow-900'
                          : user.role === 'provider'
                          ? 'bg-purple-200 text-purple-900'
                          : 'bg-green-100 text-green-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 border-b border-gray-100 text-center">
                      <button
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-700 hover:text-white bg-blue-100 hover:bg-blue-700 rounded-lg transition shadow-sm"
                        title="Edit Role"
                        onClick={() => handleToggleRole(user)}
                        disabled={user.role === 'admin'} // Prevent demoting self or other admins directly from here
                      >
                        <Pencil size={20} className="mr-2" />
                        {user.role === 'admin' ? 'Admin' : 'Promote to Admin'}
                      </button>
                      <button
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-700 hover:text-white bg-red-100 hover:bg-red-700 rounded-lg transition shadow-sm ml-3"
                        title="Delete User"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 size={20} className="mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        {/* Confirmation Modal */}
        {confirm.user && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full">
              <div className="text-center text-lg font-semibold mb-4">
                {confirm.type === 'delete'
                  ? `Are you sure you want to delete "${confirm.user.name}"?`
                  : `Are you sure you want to ${confirm.user.role === 'admin' ? 'demote' : 'promote'} "${confirm.user.name}"?`}
              </div>
              <div className="flex justify-end space-x-3 mt-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                  onClick={() => setConfirm({ type: 'delete', user: null })}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded font-semibold ${
                    confirm.type === 'delete'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={confirm.type === 'delete' ? confirmDelete : confirmRole}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
