import React, { useState, useRef, useEffect } from "react";
import { login as loginApi, register as registerApi } from "../../services/Authapi";
import { useNavigate } from "react-router-dom";

// D3 Message Component
const D3Message: React.FC<{
  type: "success" | "error";
  message: string;
  onClose: () => void;
}> = ({ type, message, onClose }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    import("d3").then((d3) => {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      const color = type === "success" ? "#22c55e" : "#ef4444";
      const icon =
        type === "success" ? "M10 17l5 5l10 -10" : "M6 6l18 18M6 24l18-18";
      svg
        .append("circle")
        .attr("cx", 20)
        .attr("cy", 20)
        .attr("r", 18)
        .attr("fill", color)
        .attr("opacity", 0.15);
      svg
        .append("path")
        .attr("d", icon)
        .attr("stroke", color)
        .attr("stroke-width", 2.5)
        .attr("fill", "none")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");
      svg
        .append("circle")
        .attr("cx", 20)
        .attr("cy", 20)
        .attr("r", 18)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("stroke-dasharray", 113)
        .attr("stroke-dashoffset", 113)
        .transition()
        .duration(600)
        .attr("stroke-dashoffset", 0);
    });
  }, [type]);

  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg ref={ref} width={40} height={40} />
      <div
        className={`mt-2 font-semibold ${
          type === "success" ? "text-green-600" : "text-red-600"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

// Redesigned Login/Register Page for Providers
const LoginRegisterProvider: React.FC = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const navigate = useNavigate();

  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Register state with providerInfo object
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    providerInfo: {
      specialization: "",
      clinicName: "",
      licenseNumber: "",
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loginApi(loginForm)
      .then(() => {
        setMsg({ type: "success", text: "Login successful!" });
        // Save token/user info if needed
        setTimeout(() => {
          navigate("/admin/providers/dashboard");
        }, 1200);
      })
      .catch(() => setMsg({ type: "error", text: "Invalid credentials." }))
      .finally(() => setLoading(false));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    registerApi({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      providerInfo: registerForm.providerInfo,
      role: "provider"
    })
      .then(() => {
        setMsg({ type: "success", text: "Registration successful!" });
        setTimeout(() => {
          navigate("/admin/providers/dashboard");
        }, 1200);
      })
      .catch(() => setMsg({ type: "error", text: "Registration failed." }))
      .finally(() => setLoading(false));
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
              className={`flex-1 py-2 font-bold transition ${
                tab === "login"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setTab("login")}
              disabled={loading}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 font-bold transition ${
                tab === "register"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setTab("register")}
              disabled={loading}
            >
              Register
            </button>
          </div>
          {msg && (
            <div className="mb-4">
              <D3Message
                type={msg.type}
                message={msg.text}
                onClose={() => setMsg(null)}
              />
            </div>
          )}
          {tab === "login" ? (
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
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm((f) => ({
                        ...f,
                        password: e.target.value,
                      }))
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
                    value={registerForm.providerInfo.clinicName}
                    onChange={(e) =>
                      setRegisterForm((f) => ({
                        ...f,
                        providerInfo: {
                          ...f.providerInfo,
                          clinicName: e.target.value,
                        },
                      }))
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    License Number
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
                    value={registerForm.providerInfo.licenseNumber}
                    onChange={(e) =>
                      setRegisterForm((f) => ({
                        ...f,
                        providerInfo: {
                          ...f.providerInfo,
                          licenseNumber: e.target.value,
                        },
                      }))
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
                    value={registerForm.providerInfo.specialization}
                    onChange={(e) =>
                      setRegisterForm((f) => ({
                        ...f,
                        providerInfo: {
                          ...f.providerInfo,
                          specialization: e.target.value,
                        },
                      }))
                    }
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterProvider;
