import React, { useState, useRef, useEffect } from "react";

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

const LoginRegisterProvider: React.FC = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Register state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    clinicName: "",
    licenseNumber: "",
    specialization: "",
  });

  // Simulate API
  const fakeApi = (success = true, delay = 1000) =>
    new Promise((resolve, reject) =>
      setTimeout(() => (success ? resolve(true) : reject()), delay)
    );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Replace with real API call
    fakeApi(
      loginForm.email === "provider@demo.com" &&
        loginForm.password === "password"
    )
      .then(() => setMsg({ type: "success", text: "Login successful!" }))
      .catch(() => setMsg({ type: "error", text: "Invalid credentials." }))
      .finally(() => setLoading(false));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Replace with real API call
    fakeApi(!!registerForm.email && !!registerForm.password)
      .then(() => setMsg({ type: "success", text: "Registration successful!" }))
      .catch(() => setMsg({ type: "error", text: "Registration failed." }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex mb-8">
          <button
            className={`flex-1 py-2 font-bold rounded-l-xl ${
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
            className={`flex-1 py-2 font-bold rounded-r-xl ${
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
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                disabled={loading}
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
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Clinic Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={registerForm.clinicName}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, clinicName: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                License Number
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={registerForm.licenseNumber}
                onChange={(e) =>
                  setRegisterForm((f) => ({
                    ...f,
                    licenseNumber: e.target.value,
                  }))
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Specialization
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={registerForm.specialization}
                onChange={(e) =>
                  setRegisterForm((f) => ({
                    ...f,
                    specialization: e.target.value,
                  }))
                }
                required
                disabled={loading}
              />
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
  );
};

export default LoginRegisterProvider;
