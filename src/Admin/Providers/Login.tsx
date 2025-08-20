import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/Authapi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginRegisterProvider: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(loginForm);
      if (response.data.role === 'provider') {
        toast.success("Provider login successful!");
        navigate("/admin/providers/dashboard");
      } else {
        toast.error("Access denied: Not a provider.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-0 w-full max-w-2xl flex overflow-hidden border border-green-100">
        {/* Left Side: Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-blue-200 w-1/2 p-8">
          <svg width={120} height={120} viewBox="0 0 60 60" className="mb-6">
            <circle cx={30} cy={30} r={28} fill="#22c55e" opacity={0.12} />
            <circle cx={30} cy={30} r={18} fill="#2563eb" opacity={0.18} />
            <rect x={18} y={28} width={24} height={4} rx={2} fill="#facc15" />
            <rect x={28} y={18} width={4} height={24} rx={2} fill="#facc15" />
          </svg>
          <div className="text-xl font-bold text-green-700 text-center">
            Provider Portal
          </div>
          <div className="text-green-900 text-center mt-2 text-sm">
            Manage your clinic, appointments, and more.
          </div>
        </div>
        {/* Right Side: Forms */}
        <div className="flex-1 p-8">
          <div className="flex mb-8 rounded-xl overflow-hidden shadow">
            <button
              className="flex-1 py-2 font-bold transition bg-green-600 text-white"
              disabled={loading}
            >
              Access Provider Account
            </button>
          </div>
          <ToastContainer />
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-200"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-200"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6 text-sm">
            To register as a provider, please contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterProvider;
