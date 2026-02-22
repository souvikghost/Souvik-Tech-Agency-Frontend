import { useState } from "react";

// --- Static Data ---
const myProjects = [
  {
    id: 1,
    name: "ABC Corp Website",
    client: "ABC Corp",
    status: "in-progress",
    startDate: "10 Feb 2026",
    dueDate: "10 Mar 2026",
    description: "Building a full e-commerce website with product listings, cart, and payment integration.",
    teammates: [
      { id: 2, name: "Sarah Khan", initials: "SK" },
      { id: 3, name: "Mike Ross",  initials: "MR" },
    ],
  },
  {
    id: 2,
    name: "Nova Brand Identity",
    client: "Nova Studio",
    status: "in-progress",
    startDate: "5 Feb 2026",
    dueDate: "5 Apr 2026",
    description: "Logo design, typography selection, and full brand guideline document.",
    teammates: [
      { id: 2, name: "Sarah Khan", initials: "SK" },
    ],
  },
  {
    id: 3,
    name: "Acme Dashboard",
    client: "Acme Inc",
    status: "completed",
    startDate: "15 Jan 2026",
    dueDate: "15 Feb 2026",
    description: "Admin dashboard with analytics, user management, and reporting features.",
    teammates: [],
  },
];

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

// --- Update Status Modal ---
const UpdateStatusModal = ({ project, onClose, onUpdate }) => {
  const options = ["in-progress", "completed"];
  const [selected, setSelected] = useState(project.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">Update Status</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest">Project</p>
          <p className="text-primary font-semibold text-sm">{project.name}</p>
          <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest mt-3">Select Status</p>
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <button key={opt} onClick={() => setSelected(opt)}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm font-semibold capitalize text-left transition ${selected === opt ? "bg-primary text-secondary border-primary" : "border-primary/15 text-primary/60 hover:border-primary/40"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">Cancel</button>
          <button onClick={() => { onUpdate(project.id, selected); onClose(); }}
            className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Project Card ---
const ProjectCard = ({ project, onUpdateStatus }) => (
  <div className="bg-white border border-primary/8 rounded-2xl p-5 flex flex-col gap-4">

    {/* Header */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <h4 className="text-primary font-bold text-sm">{project.name}</h4>
        <p className="text-primary/60 text-xs mt-0.5">{project.client}</p>
      </div>
      <StatusBadge status={project.status} />
    </div>

    {/* Description */}
    <p className="text-primary/50 text-xs flex-1 leading-relaxed">{project.description}</p>

    {/* Dates */}
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-primary/4 rounded-lg px-3 py-2">
        <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest">Started</p>
        <p className="text-primary text-xs font-semibold mt-0.5">{project.startDate}</p>
      </div>
      <div className="bg-primary/4 rounded-lg px-3 py-2">
        <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest">Due</p>
        <p className="text-primary text-xs font-semibold mt-0.5">{project.dueDate}</p>
      </div>
    </div>

    {/* Teammates */}
    {project.teammates.length > 0 && (
      <div>
        <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest mb-2">Teammates</p>
        <div className="flex items-center -space-x-2">
          {project.teammates.map((t) => (
            <div key={t.id} title={t.name}
              className="w-7 h-7 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {t.initials}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Update status — only for in-progress */}
    {project.status === "in-progress" ? (
  <button onClick={() => onUpdateStatus(project)}
    className="w-full text-xs py-2 rounded-lg border border-primary/15 text-primary font-semibold hover:bg-primary hover:text-secondary transition">
    Update Status
  </button>
) : (
  <button disabled
    className="w-full cursor-not-allowed text-xs py-2 rounded-lg border border-emerald-200 text-emerald-500 font-semibold cursor-not-allowed opacity-60">
    Completed
  </button>
)}
  </div>
);

// --- Main ---
const EmployeeProjects = () => {
  const [updateTarget, setUpdateTarget] = useState(null);

  const handleUpdate = (id, status) => console.log("Update project", id, "to", status);

  return (
    <div className="space-y-4">

      <div>
        <h2 className="text-primary font-display text-2xl font-bold">My Projects</h2>
        <p className="text-primary/60 text-sm mt-1">Projects assigned to you</p>
      </div>

      {myProjects.length === 0 ? (
        <div className="flex items-center justify-center h-40 bg-white border border-primary/8 rounded-2xl">
          <p className="text-primary/30 text-sm">No projects assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onUpdateStatus={setUpdateTarget} />
          ))}
        </div>
      )}

      {updateTarget && (
        <UpdateStatusModal
          project={updateTarget}
          onClose={() => setUpdateTarget(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default EmployeeProjects;