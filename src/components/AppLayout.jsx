import UniversalUI from "./UniversalUI";
import { adminNav, employeeNav, clientNav } from "../utils/navLinks";
import { useAuth } from "../context/AuthContext";

const navMap = {
  admin: adminNav,
  employee: employeeNav,
  client: clientNav,
};

export default function AppLayout() {
  const { user } = useAuth();
  const role = user?.role;
  const navItems = navMap[role];

  if (!navItems) return (
  <div className="min-h-screen bg-secondary flex flex-col items-center justify-center gap-4">
    <h1 className="font-display text-primary text-2xl font-bold leading-tight text-center">
      Souvik <br />
      <span className="bg-primary text-secondary px-2 py-0.5 rounded-sm">Tech Agency</span>
    </h1>
    <div className="bg-white border border-primary/8 rounded-2xl px-8 py-6 flex flex-col items-center gap-3 max-w-sm w-full mx-4 text-center">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-lg">✕</div>
      <p className="text-primary font-semibold text-base">Invalid Session</p>
      <p className="text-primary/60 text-sm">Your role could not be verified. Please log in again to continue.</p>
      <a href="/login" className="mt-1 px-5 py-2 bg-primary text-secondary text-sm font-semibold rounded-lg hover:bg-primary/90 transition">
        Back to Login
      </a>
    </div>
  </div>
);

  return (
    <div className="min-h-screen w-screen">
      <UniversalUI role={role} navItems={navItems} />
    </div>
  );
}