import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CalendarCheck2, User, History, LogOut } from "lucide-react";

const navItems = [
    {
        label: "Profile",
        icon: <User size={20} className="mr-2" />,
        path: "/dashboard/profile",
    },
    {
        label: "Appointments",
        icon: <CalendarCheck2 size={20} className="mr-2" />,
        path: "/dashboard/appointments",
    },
    {
        label: "History",
        icon: <History size={20} className="mr-2" />,
        path: "/dashboard/history",
    },
];

const SIDEBAR_WIDTH = 220;

const PatientDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardRoot = location.pathname === "/Dashboard";

  const handleLogout = () => {
    // Clear patient session/token here if needed
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full bg-white shadow-lg flex flex-col z-20"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <img
            src="/MediBook.png"
            alt="MediBook"
            className="w-10 h-10 mr-2"
          />
          <span className="font-bold text-lg tracking-wide text-green-700">
            MediBook
          </span>
        </div>
        <nav className="flex-1 py-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 hover:bg-green-100 rounded transition ${
                    location.pathname === item.path
                      ? "bg-green-100 text-green-700 font-semibold"
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
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg transition font-bold gap-2 justify-center"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main
        className="flex-1 flex flex-col items-center justify-center"
        style={{ marginLeft: SIDEBAR_WIDTH, minHeight: "100vh" }}
      >
        <div className="w-full max-w-4xl p-8">
          {isDashboardRoot && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-green-700 mb-2">
                Welcome to your Dashboard!
              </h1>
              <p className="text-gray-600 text-lg">
                Please pick an option from the sidebar to get started.
              </p>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
