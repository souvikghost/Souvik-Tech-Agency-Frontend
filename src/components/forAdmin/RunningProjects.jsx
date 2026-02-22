import { useState } from "react";

// --- Static Data (no pending) ---
const staticProjects = [
  {
    id: 1,
    name: "ABC Corp Website",
    client: "ABC Corp",
    status: "in-progress",
    startDate: "10 Feb 2026",
    dueDate: "10 Mar 2026",
    employees: [
      { id: 1, name: "John Doe", initials: "JD", email: "john@souviktechagency.com", role: "employee" },
      { id: 2, name: "Sarah Khan", initials: "SK", email: "sarah@souviktechagency.com", role: "employee" },
      { id: 3, name: "Mike Ross", initials: "MR", email: "mike@souviktechagency.com", role: "employee" },
    ],
  },
  {
    id: 2,
    name: "XYZ SEO Campaign",
    client: "XYZ Ltd",
    status: "completed",
    startDate: "1 Feb 2026",
    dueDate: "28 Feb 2026",
    employees: [{ id: 2, name: "Sarah Khan", initials: "SK", email: "sarah@souviktechagency.com", role: "employee" }],
  },
  {
    id: 3,
    name: "Nova Brand Identity",
    client: "Nova Studio",
    status: "in-progress",
    startDate: "5 Feb 2026",
    dueDate: "5 Apr 2026",
    employees: [
      { id: 1, name: "John Doe", initials: "JD", email: "john@souviktechagency.com", role: "employee" },
      { id: 2, name: "Sarah Khan", initials: "SK", email: "sarah@souviktechagency.com", role: "employee" },
    ],
  },
  {
    id: 4,
    name: "Acme Dashboard",
    client: "Acme Inc",
    status: "completed",
    startDate: "15 Jan 2026",
    dueDate: "15 Feb 2026",
    employees: [{ id: 3, name: "Mike Ross", initials: "MR", email: "mike@souviktechagency.com", role: "employee" }],
  },
];

// --- Status styles ---
const statusStyles = {
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  stopped: "bg-red-100 text-red-600",
};

const StatusBadge = ({ status }) => <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || "bg-primary/10 text-primary"}`}>{status}</span>;

// --- Employee Detail Modal ---
const EmployeeModal = ({ employee, projectId, onRemove, onClose, projectStatus }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">
      <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
        <h3 className="text-primary font-bold text-base">Employee Detail</h3>
        <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
          ✕
        </button>
      </div>
      <div className="px-6 py-5 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary text-secondary text-xl font-bold flex items-center justify-center">{employee.initials}</div>
        <div className="text-center">
          <p className="text-primary font-bold text-xl">{employee.name}</p>
          <p className="text-primary/80 italic text-sm mt-0.5">{employee.email}</p>
          <p className="text-primary/60 text-xs capitalize mt-0.5">{employee.role}</p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
          Close
        </button>
        {projectStatus !== "completed" && (
          <button
            onClick={() => {
              onRemove(projectId, employee.id);
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Remove from Project
          </button>
        )}
      </div>
    </div>
  </div>
);

// --- Confirm Stop Modal ---
const ConfirmStopModal = ({ project, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">
      <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
        <h3 className="text-primary font-bold text-base">Stop Project</h3>
        <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
          ✕
        </button>
      </div>
      <div className="px-6 py-5 space-y-2">
        <p className="text-primary text-sm">
          Are you sure you want to <span className="font-bold text-red-500">stop</span> this project?
        </p>
        <div className="bg-primary/4 rounded-lg p-3 space-y-1">
          <p className="text-primary text-xs font-semibold">{project.name}</p>
          <p className="text-primary/50 text-xs">Client: {project.client}</p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
          Cancel
        </button>
        <button onClick={() => onConfirm(project.id)} className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
          Yes, Stop
        </button>
      </div>
    </div>
  </div>
);

// --- Avatar ---
const EmployeeAvatar = ({ employee, onClick }) => (
  <div title={employee.name} onClick={() => onClick(employee)} className="w-8 h-8 rounded-full bg-primary text-secondary text-xs font-bold flex items-center justify-center cursor-pointer ring-2 ring-white hover:ring-primary/40 hover:scale-110 transition-all">
    {employee.initials}
  </div>
);

// --- Project Card ---
const ProjectCard = ({ project, onStop, onSelectEmployee }) => (
  <div className="bg-white border border-primary/8 rounded-2xl p-5 flex flex-col gap-4">
    <div className="flex items-start justify-between gap-2">
      <div>
        <h4 className="text-primary font-bold text-sm">{project.name}</h4>
        <p className="text-primary/60 text-xs mt-0.5">{project.client}</p>
      </div>
      <StatusBadge status={project.status} />
    </div>

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

    <div>
      <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest mb-2">Assigned Team</p>
      {project.employees.length > 0 ? (
        <div className="flex items-center -space-x-2">
          {project.employees.map((emp) => (
            <EmployeeAvatar key={emp.id} employee={emp} onClick={(emp) => onSelectEmployee(emp, project.id, project.status)} />
          ))}
        </div>
      ) : (
        <p className="text-primary/30 text-xs">No employees assigned</p>
      )}
    </div>

    {project.status === "in-progress" && (
      <button onClick={() => onStop(project)} className="w-full text-xs py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-500 hover:text-white font-semibold transition">
        Stop Project
      </button>
    )}
  </div>
);

// --- Filter Toggle ---
const filters = ["all", "in-progress", "completed"];

const FilterToggle = ({ active, onChange }) => (
  <div className="flex items-center bg-primary/6 rounded-full p-1 gap-0.5">
    {filters.map((f) => (
      <button key={f} onClick={() => onChange(f)} className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${active === f ? "bg-primary text-secondary shadow" : "text-primary/50 hover:text-primary"}`}>
        {f === "in-progress" ? "Running" : f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    ))}
  </div>
);

// --- Main ---
const RunningProjects = () => {
  const [filter, setFilter] = useState("all");
  const [stopTarget, setStopTarget] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // { employee, projectId }

  const filtered = staticProjects.filter((p) => filter === "all" || p.status === filter);

  const handleRemoveEmployee = (projectId, employeeId) => {
    console.log("Remove employee", employeeId, "from project", projectId);
  };

  const handleConfirmStop = (id) => {
    console.log("Stop project", id);
    setStopTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">Projects</h2>
          <p className="text-primary/60 text-sm mt-1">Track and manage all projects</p>
        </div>
        <FilterToggle active={filter} onChange={setFilter} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} onStop={setStopTarget} onSelectEmployee={(emp, projectId, projectStatus) => setSelectedEmployee({ employee: emp, projectId, projectStatus })} />
        ))}
      </div>

      {/* Employee detail modal */}
      {selectedEmployee && <EmployeeModal employee={selectedEmployee.employee} projectId={selectedEmployee.projectId} projectStatus={selectedEmployee.projectStatus} onRemove={handleRemoveEmployee} onClose={() => setSelectedEmployee(null)} />}

      {/* Stop confirm modal */}
      {stopTarget && <ConfirmStopModal project={stopTarget} onConfirm={handleConfirmStop} onClose={() => setStopTarget(null)} />}
    </div>
  );
};

export default RunningProjects;
