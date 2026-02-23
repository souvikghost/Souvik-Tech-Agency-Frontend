import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import Login from "./Login";
import AllUsers from "./forAdmin/AllUsers";
import Services from "./forAdmin/Services";
import ServiceRequest from "./forAdmin/ServiceRequest";
import RunningProjects from "./forAdmin/RunningProjects";
import AdminDashboard from "./forAdmin/AdminDashboard";
import OwnProfile from "./OwnProfile";
import RunningProjectsForEmployee from "./forEmployee/RunningProjectsForEmployee";
import ListedServices from "./forClient/ListedServices";
import ApprovedProjects from "./forClient/ApprovedProjects";
import SubmittedProjectRequest from "./forClient/SubmittedProjectRequest";
import Messages from "./Messages";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AllUsers /> },
      { path: "services", element: <Services /> },
      { path: "requests", element: <ServiceRequest /> },
      { path: "projects", element: <RunningProjects /> },
      { path: "messages", element: <Messages /> },
      { path: "profile", element: <OwnProfile /> },
    ],
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute role="employee">
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="projects" /> },
      { path: "projects", element: <RunningProjectsForEmployee /> },
      { path: "messages", element: <Messages /> },
      { path: "profile", element: <OwnProfile role="employee" /> },
    ],
  },
  {
    path: "/client",
    element: (
      <ProtectedRoute role="client">
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="services" /> },
      { path: "services", element: <ListedServices /> },
      { path: "requests", element: <SubmittedProjectRequest /> },
      { path: "projects", element: <ApprovedProjects /> },
      { path: "messages", element: <Messages /> },
      { path: "profile", element: <OwnProfile role="client" /> },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default function Body() {
  return <RouterProvider router={router} />;
}