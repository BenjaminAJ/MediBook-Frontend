import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../src/services/Authapi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({ email, password });
      if (response.data.user.role === 'admin') {
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Access denied: Not an admin.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">
      <ToastContainer />
      <div className="relative bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-yellow-500">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <span className="inline-block bg-yellow-500 text-gray-900 px-4 py-1 rounded-full font-bold shadow-lg text-sm tracking-widest uppercase">
            Admin
          </span>
        </div>
        <div className="flex flex-col items-center mb-8 mt-4">
          <img
            src="/MediBook.png"
            alt="MediBook Admin"
            className="w-16 h-16 mb-2 rounded-full border-4 border-yellow-500 shadow"
          />
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-1 tracking-wide">
            MediBook Admin Portal
          </h2>
          <p className="text-gray-300 text-sm">Restricted access for administrators</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-200">Email</label>
            <input
              type="email"
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Admin email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-200">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border border-gray-700 bg-gray-900 text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Admin password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-yellow-400"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
