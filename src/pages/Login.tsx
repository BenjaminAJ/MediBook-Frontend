import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import D3Message from '../components/D3Message';
import { login } from '../services/Authapi';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // Rename to avoid conflict with service login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    try {
      const response = await login({ email, password }); // Call the API login
      const userData = response.data; 
      authLogin({ id: userData._id, email: userData.email, name: userData.name, role: userData.role, token: userData.token }); // Store user in context and local storage
      setMessage({ type: 'success', text: 'Login successful!' });
      setTimeout(() => {
        navigate('/Dashboard');
      }, 1000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text:
          err?.response?.data?.message ||
          err?.message ||
          'Invalid credentials.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/MediBook.png"
            alt="MediBook Logo"
            className="w-16 h-16 mb-2"
          />
          <h2 className="text-3xl font-extrabold text-blue-700 mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-500">Login to your MediBook account</p>
        </div>
        {message && (
          <D3Message
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
