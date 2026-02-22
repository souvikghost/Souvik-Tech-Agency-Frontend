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

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
        <AppLayout />
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AllUsers/> },
      { path: "services", element: <Services/> },
      { path: "requests", element: <ServiceRequest/> },
      { path: "projects", element: <RunningProjects/> },
      { path: "profile", element: <OwnProfile/> },
    ],
  },
  {
    path: "/employee",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="projects" /> },
      { path: "projects", element: <RunningProjectsForEmployee /> },
      { path: "profile", element: <OwnProfile role="employee" />, handle: { title: "Profile" } },
    ],
  },
  {
    path: "/client",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="services" /> },
      { path: "services", element: <ListedServices /> },
      { path: "requests", element: <SubmittedProjectRequest /> },
      { path: "projects", element: <ApprovedProjects /> },
      { path: "profile", element: <OwnProfile role="client" />, handle: { title: "Profile" } },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function Body() {
  return <RouterProvider router={router} />;
}
