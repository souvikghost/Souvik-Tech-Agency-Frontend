import { svgPacket } from "../utils/svgPacket";

export const adminNav = [
  { path: "/admin/dashboard", label: "Dashboard", icon: svgPacket["dashboardIcon"], end: true },
  { path: "/admin/users",     label: "Users",     icon: svgPacket["usersIcon"] },
  { path: "/admin/services",  label: "Services",  icon: svgPacket["servicesIcon"] },
  { path: "/admin/requests",  label: "Requests",  icon: svgPacket["requestIcon"] },
  { path: "/admin/projects",  label: "Projects",  icon: svgPacket["projectsIcon"] },
  { path: "/admin/profile",   label: "Profile",   icon: svgPacket["noProfileIcon"] },
  { path: "/admin/messages",   label: "Messages",   icon: svgPacket["messageIcon"] },
];

export const employeeNav = [
  { path: "/employee/projects", label: "Projects", icon: svgPacket["projectsIcon"], end: true },
  { path: "/employee/profile",  label: "Profile",  icon: svgPacket["noProfileIcon"] },
  { path: "/employee/messages",  label: "Messages",  icon: svgPacket["messageIcon"] },
];

export const clientNav = [
  { path: "/client/services",  label: "Services",  icon: svgPacket["servicesIcon"], end: true },
  { path: "/client/requests",  label: "My Requests", icon: svgPacket["requestIcon"] },
  { path: "/client/projects",  label: "My Projects", icon: svgPacket["projectsIcon"] },
  { path: "/client/profile",   label: "Profile",     icon: svgPacket["noProfileIcon"] },
  { path: "/client/messages",   label: "Messages",     icon: svgPacket["messageIcon"] },
];