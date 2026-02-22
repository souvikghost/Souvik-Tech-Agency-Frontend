import { useState } from "react";
import { NavLink, Outlet, useNavigate, useMatches } from "react-router-dom";

export default function UniversalUI({ navItems, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const matches = useMatches();

  const title = matches.findLast((m) => m.handle?.title)?.handle?.title || "Dashboard";

  return (
    <div className="flex h-screen bg-primary overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed z-30 top-0 left-0 h-full w-56 flex flex-col bg-primary transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>

        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <h1 className="font-railway font-bold text-white text-xl leading-tight">
            Souvik <br />
            <span className="bg-secondary/80 text-primary px-2 rounded-sm">Tech Agency</span>
          </h1>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${isActive ? "bg-white/15 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/8"}`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10">
          <button onClick={() => navigate(`/${role}/profile`)} className="w-full flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-medium shrink-0">
              S
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-white text-base font-semibold truncate">Souvik Ghosh</p>
              <p className="text-white/40 text-xs font-semibold capitalize">{role}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col m-1.5 bg-secondary overflow-hidden rounded-2xl">

        {/* Header */}
        <header className="h-14 px-4 lg:px-6 flex items-center justify-between border-b border-primary/8 shrink-0">

          {/* Hamburger (mobile) */}
          <button className="lg:hidden p-1.5 rounded-md text-primary hover:bg-primary/8 transition" onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb (desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-base font-semibold">
            <span className="capitalize text-primary/50">{role}</span>
            <span className="text-primary/30">/</span>
            <span className="text-primary">{title}</span>
          </div>

          {/* Logout */}
          <button className="ml-auto text-sm font-semibold px-3 py-1.5 rounded-lg border bg-primary text-secondary transition">
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}