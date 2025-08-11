import React, { useState } from 'react';
import { Trash2, Pencil, ShieldCheck } from 'lucide-react';

// Demo user data
type User = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

const initialUsers: User[] = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
  { id: 2, name: 'John Smith', email: 'john@example.com', role: 'admin' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'user' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleToggleRole = (id: number) => {
    setUsers(users =>
      users.map(user =>
        user.id === id
          ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
          : user
      )
    );
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400 text-lg">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-blue-100/40 transition">
                    <td className="px-6 py-5 border-b border-gray-100 text-lg font-semibold text-gray-800">{user.name}</td>
                    <td className="px-6 py-5 border-b border-gray-100 text-lg text-gray-700">{user.email}</td>
                    <td className="px-6 py-5 border-b border-gray-100 capitalize text-lg">
                      <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-bold shadow-sm
                        ${user.role === 'admin'
                          ? 'bg-yellow-200 text-yellow-900'
                          : 'bg-green-100 text-green-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 border-b border-gray-100 text-center">
                      <button
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-700 hover:text-white bg-blue-100 hover:bg-blue-700 rounded-lg transition shadow-sm"
                        title="Edit Role"
                        onClick={() => handleToggleRole(user.id)}
                      >
                        <Pencil size={20} className="mr-2" />
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-700 hover:text-white bg-red-100 hover:bg-red-700 rounded-lg transition shadow-sm ml-3"
                        title="Delete User"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={20} className="mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default UserManagement;
