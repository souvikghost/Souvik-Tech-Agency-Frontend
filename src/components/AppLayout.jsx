import UniversalUI from "./UniversalUI";
import { adminNav, employeeNav, clientNav } from "../utils/navLinks";

const navMap = {
  admin: adminNav,
  employee: employeeNav,
  client: clientNav,
};

export default function AppLayout({ role }) {
  const navItems = navMap[role];

  if (!navItems) return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <p className="text-primary/40 text-sm">Invalid role. Please <a href="/login" className="underline text-primary">login again</a>.</p>
    </div>
  );

  return (
    <div className="min-h-screen w-screen">
      <UniversalUI role={role} navItems={navItems} />
    </div>
  );
}