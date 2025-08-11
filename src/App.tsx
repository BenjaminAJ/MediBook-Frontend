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
]);

function App(): React.ReactElement {
  return <RouterProvider router={router} />;
}

export default App;
