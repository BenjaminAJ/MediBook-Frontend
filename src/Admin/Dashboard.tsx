import React from "react";
import { Users, FileText } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "User Management",
    icon: <Users size={20} className="mr-2" />,
    path: "/admin/dashboard/users",
  },
  {
    label: "Audit Logs",
    icon: <FileText size={20} className="mr-2" />,
    path: "/admin/dashboard/audit-logs",
  },
];

const SIDEBAR_WIDTH = 256; // 64 * 4 (w-64)

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  const isDashboardRoot = location.pathname === "/admin/dashboard";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-100 flex flex-col z-20"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-800">
          <img
            src="/MediBook.png"
            alt="MediBook Admin"
            className="w-10 h-10 mr-2"
          />
          <span className="font-bold text-lg tracking-wide text-yellow-400">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 py-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 hover:bg-gray-800 rounded transition ${
                    location.pathname === item.path
                      ? "bg-gray-800 text-yellow-400 font-semibold"
                      : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <main
        className="flex flex-col items-center justify-center"
        style={{ marginLeft: SIDEBAR_WIDTH, minHeight: "100vh" }}
      >
        <div className="p-8">
          {isDashboardRoot && (
            <>
              <h1 className="text-3xl font-bold mb-4 text-gray-800">
                Welcome, Admin!
              </h1>
              <p className="text-gray-600 mb-8">
                Use the sidebar to manage users or review audit logs.
              </p>
            </>
          )}
          {/* Nested routes will render here if using react-router Outlet */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
