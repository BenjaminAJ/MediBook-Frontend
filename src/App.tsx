import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./Admin/Login";
import AdminDashboard from "./Admin/Dashboard";
import AdminUserManagement from "./Admin/UserManagement";
import AdminAuditLogs from "./Admin/AuditLogs";
import PatientDashboard from "./pages/patientdashboard/Dashboard";
import PatientHistory from "./pages/patientdashboard/History";
import PatientProfile from "./pages/patientdashboard/Profile";
import PatientAppointments from "./pages/patientdashboard/Appointments";

// Admin dashboard layout with nested routes
const adminDashboardRoutes: RouteObject = {
  path: "/admin/dashboard",
  element: <AdminDashboard />,
  children: [
    { path: "users", 
      element: <AdminUserManagement />
    },
    { path: "audit-logs", 
      element: <AdminAuditLogs /> 
    },
  ],
};

// Patient dashboard layout with nested routes
const patientDashboardRoutes: RouteObject = {
  path: "/dashboard",
  element: <PatientDashboard />,
  children: [
    { path: "history", element: <PatientHistory /> },
    { path: "profile", element: <PatientProfile /> },
    { path: "appointments", element: <PatientAppointments /> },
  ],
};

const router = createBrowserRouter([
  { path: "/", 
    element: <Login /> 
  },
  { path: "/register", 
    element: <Register /> 
  },
  { path: "/admin/login", 
    element: <AdminLogin /> 
  },
  adminDashboardRoutes,
  patientDashboardRoutes,
]);

function App(): React.ReactElement {
  return <RouterProvider router={router} />;
}

export default App;
