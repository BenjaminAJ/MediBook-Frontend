import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject
} from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./Admin/Login";
import AdminDashboard from "./Admin/Dashboard";
import AdminUserManagement from "./Admin/UserManagement";
import AdminAuditLogs from "./Admin/AuditLogs";
import CreateProvider from "./Admin/CreateProvider";
import PatientDashboard from "./pages/patientdashboard/Dashboard";
import PatientHistory from "./pages/patientdashboard/History";
import PatientProfile from "./pages/patientdashboard/Profile";
import PatientAppointments from "./pages/patientdashboard/Appointments";
import ProviderDashboard from "./Admin/Providers/Dashboard";
import ProviderManageSchedule from "./Admin/Providers/ManageSchedule";
import ProviderUpdateAvailability from "./Admin/Providers/UpdateAvailability";
import ProviderViewAppointments from "./Admin/Providers/ViewAppointments";
import ProviderLogin from "./Admin/Providers/Login";
import NotFound from "./pages/NotFound";
import RegisterMedicalInfo from "./pages/RegisterMedicalInfo";

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
    { path: "create-provider",
      element: <CreateProvider />
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

// Provider dashboard layout with nested routes
const providerDashboardRoutes: RouteObject = {
  path: "/provider/dashboard",
  element: <ProviderDashboard />,
  children: [
    { path: "schedule", element: <ProviderManageSchedule /> },
    { path: "appointments", element: <ProviderViewAppointments /> },
    { path: "availability", element: <ProviderUpdateAvailability /> },
  ],
};


const router = createBrowserRouter([
  { path: "/", 
    element: <Login /> 
  },
  { path: "/register", 
    element: <Register /> 
  },
  { path: "/register-medical-info",
    element: <RegisterMedicalInfo />
  },
  { path: "/admin/login", 
    element: <AdminLogin /> 
  },
  { path: "/provider/login", 
    element: <ProviderLogin /> 
  },
  adminDashboardRoutes,
  patientDashboardRoutes,
  providerDashboardRoutes,
  { path: "*", element: <NotFound /> },
]);
function App(): React.ReactElement {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  );
}

export default App;
