import { useState } from "react";

// --- Static Data ---
const myProjects = [
  {
    id: 1,
    name: "ABC Corp Website",
    service: "Web Development",
    status: "in-progress",
    startDate: "10 Feb 2026",
    dueDate: "10 Mar 2026",
    team: [
      { id: 1, name: "John Doe",   initials: "JD" },
      { id: 2, name: "Sarah Khan", initials: "SK" },
    ],
  },
  {
    id: 2,
    name: "ABC Corp Website",
    service: "SEO Optimization",
    status: "completed",
    startDate: "1 Feb 2026",
    dueDate: "28 Feb 2026",
    team: [
      { id: 2, name: "Sarah Khan", initials: "SK" },
    ],
  },
];

// --- Status styles ---
const statusStyles = {
  "in-progress": "bg-blue-100 text-blue-700",
  completed:     "bg-emerald-100 text-emerald-700",
  pending:       "bg-yellow-100 text-yellow-700",
};

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || "bg-primary/10 text-primary"}`}>
    {status}
  </span>
);

// --- Project Card (read only) ---
const ProjectCard = ({ project }) => (
  <div className="bg-white border border-primary/8 rounded-2xl p-5 flex flex-col gap-4">

    {/* Header */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <h4 className="text-primary font-bold text-sm">{project.name}</h4>
        <p className="text-primary/60 text-xs mt-0.5">{project.service}</p>
      </div>
      <StatusBadge status={project.status} />
    </div>

    {/* Start date only */}
    <div className="bg-primary/4 rounded-lg px-2 w-2/4 py-2 ">
      <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest">Started</p>
      <p className="text-primary text-xs font-semibold mt-0.5">{project.startDate}</p>
    </div>

    {/* Team */}
    <div>
      <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest mb-2">Assigned Team</p>
      {project.team.length > 0 ? (
        <div className="flex items-center -space-x-2">
          {project.team.map((t) => (
            <div key={t.id} title={t.name}
              className="w-7 h-7 rounded-full bg-primary text-secondary text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {t.initials}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-primary/30 text-xs">No team assigned yet</p>
      )}
    </div>
  </div>
);

// --- Filter Toggle ---
const filters = ["all", "in-progress", "completed"];

const FilterToggle = ({ active, onChange }) => (
  <div className="flex items-center bg-primary/6 rounded-full p-1 gap-0.5">
    {filters.map((f) => (
      <button key={f} onClick={() => onChange(f)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${active === f ? "bg-primary text-secondary shadow" : "text-primary/50 hover:text-primary"}`}>
        {f === "in-progress" ? "Running" : f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    ))}
  </div>
);

// --- Main ---
const ApprovedProjects = () => {
  const [filter, setFilter] = useState("all");

  const filtered = myProjects.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">My Projects</h2>
          <p className="text-primary/60 text-sm mt-1">Track your approved projects</p>
        </div>
        <FilterToggle active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-40 bg-white border border-primary/8 rounded-2xl">
          <p className="text-primary/30 text-sm">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedProjects;