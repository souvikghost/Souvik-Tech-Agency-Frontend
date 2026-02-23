import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, updateProjectStatus, assignEmployees } from "../../api/projects";
import { getEmployees } from "../../api/user";
import StatusBadge from "../../components/StatusBadge";
import { getInitials, formatDate } from "../../utils/constants";
import useToast from "../../hooks/useToast";

// --- Filter Toggle ---
const filters = ["all", "in-progress", "completed", "stopped"];

const FilterToggle = ({ active, onChange }) => (
  <div className="flex items-center bg-primary/6 rounded-full p-1 gap-0.5 flex-wrap">
    {filters.map((f) => (
      <button key={f} onClick={() => onChange(f)} className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${active === f ? "bg-primary text-secondary shadow" : "text-primary/50 hover:text-primary"}`}>
        {f === "in-progress" ? "Running" : f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    ))}
  </div>
);

// --- Employee Detail Modal ---
const EmployeeModal = ({ employee, project, onRemove, onClose, isPending }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">
      <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
        <h3 className="text-primary font-bold text-base">Employee Detail</h3>
        <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
          ✕
        </button>
      </div>
      <div className="px-6 py-5 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary text-secondary text-xl font-bold flex items-center justify-center">{getInitials(employee.name)}</div>
        <div className="text-center">
          <p className="text-primary font-bold text-xl">{employee.name}</p>
          <p className="text-primary/60 italic text-sm mt-0.5">{employee.email}</p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
          Close
        </button>
        {project.status === "in-progress" && (
          <button onClick={() => onRemove(project, employee)} disabled={isPending} className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50">
            {isPending ? "Removing..." : "Remove from Project"}
          </button>
        )}
      </div>
    </div>
  </div>
);

// --- Assign Employees Modal ---
const AssignModal = ({ project, allEmployees, onClose, onSave, isPending }) => {
  const currentIds = project.employees.map((e) => e._id);
  const [selected, setSelected] = useState(currentIds);

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">Assign Employees</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-2 max-h-72 overflow-y-auto">
          {allEmployees.length === 0 ? (
            <p className="text-primary/30 text-sm text-center py-4">No employees found.</p>
          ) : (
            allEmployees.map((emp) => (
              <label key={emp._id} className="flex items-center gap-3 p-3 rounded-xl border border-primary/8 hover:bg-primary/4 cursor-pointer transition">
                <input type="checkbox" checked={selected.includes(emp._id)} onChange={() => toggle(emp._id)} className="accent-primary w-4 h-4" />
                <div className="w-8 h-8 rounded-full bg-primary text-secondary text-xs font-bold flex items-center justify-center shrink-0">{getInitials(emp.name)}</div>
                <div>
                  <p className="text-primary text-sm font-semibold">{emp.name}</p>
                  <p className="text-primary/40 text-xs">{emp.email}</p>
                </div>
              </label>
            ))
          )}
        </div>
        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
            Cancel
          </button>
          <button onClick={() => onSave(project._id, selected)} disabled={isPending} className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition disabled:opacity-50">
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Confirm Complete Modal ---
const ConfirmCompleteModal = ({ project, onConfirm, onClose, isPending }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">
      <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
        <h3 className="text-primary font-bold text-base">Complete Project</h3>
        <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
          ✕
        </button>
      </div>
      <div className="px-6 py-5 space-y-2">
        <p className="text-primary text-sm">
          Mark this project as <span className="font-bold text-emerald-600">successfully completed</span>?
        </p>
        <div className="bg-primary/4 rounded-xl p-3 space-y-1">
          <p className="text-primary text-xs font-semibold">{project.name}</p>
          <p className="text-primary/50 text-xs">Client: {project.client?.name}</p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
          Cancel
        </button>
        <button onClick={() => onConfirm(project._id)} disabled={isPending} className="px-4 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition disabled:opacity-50">
          {isPending ? "Completing..." : "Yes, Complete"}
        </button>
      </div>
    </div>
  </div>
);

// --- Confirm Stop Modal ---
const ConfirmStopModal = ({ project, onConfirm, onClose, isPending }) => (
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
        <div className="bg-primary/4 rounded-xl p-3 space-y-1">
          <p className="text-primary text-xs font-semibold">{project.name}</p>
          <p className="text-primary/50 text-xs">
            Client: {project.client?.name}
            {project.client?.isDeleted && <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-400">deleted</span>}
          </p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
          Cancel
        </button>
        <button onClick={() => onConfirm(project._id)} disabled={isPending} className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50">
          {isPending ? "Stopping..." : "Yes, Stop"}
        </button>
      </div>
    </div>
  </div>
);

// --- Project Card ---
const ProjectCard = ({ project, onStop, onComplete, onSelectEmployee, onAssign }) => (
  <div className="bg-white border border-primary/8 rounded-2xl p-5 flex flex-col gap-4">
    <div className="flex items-start justify-between gap-2">
      <div>
        <h4 className="text-primary font-bold text-sm">{project.name}</h4>
        <div className="flex items-center gap-1 flex-wrap">
          <p className={`text-xs mt-0.5 ${project.client?.isDeleted ? "text-primary/30" : "text-primary/40"}`}>{project.client?.name || "—"}</p>
          {project.client?.isDeleted && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-400">deleted</span>}
        </div>
      </div>
      <StatusBadge status={project.status} />
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="bg-primary/4 rounded-lg px-3 py-2">
        <p className="text-primary/40 text-[10px] font-semibold uppercase tracking-widest">Started</p>
        <p className="text-primary/30 tracking-tighter font-mono text-xs mt-0.5">{formatDate(project.createdAt)}</p>
      </div>
      <div className="bg-primary/4 rounded-lg px-3 py-2">
        <p className="text-primary/40 text-[10px] font-semibold uppercase tracking-widest">Company</p>
        <p className="text-primary text-xs font-semibold mt-0.5">{project.client?.company || "—"}</p>
      </div>
    </div>

    <div>
      <p className="text-primary/40 text-[10px] font-semibold uppercase tracking-widest mb-2">Assigned Team</p>
      {project.employees?.length > 0 ? (
        <div className="flex items-center -space-x-2">
          {project.employees.map((emp) => (
            <div key={emp._id} title={emp.name} onClick={() => onSelectEmployee(emp, project)} className="w-8 h-8 rounded-full bg-primary text-secondary text-xs font-bold flex items-center justify-center cursor-pointer ring-2 ring-white hover:ring-primary/40 hover:scale-110 transition-all">
              {getInitials(emp.name)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-primary/30 text-xs">No employees assigned</p>
      )}
    </div>

    <div className="flex gap-2">
      {project.status === "in-progress" && (
        <>
          <button onClick={() => onAssign(project)} className="flex-1 text-xs py-2 rounded-lg border border-primary/15 text-primary font-semibold hover:bg-primary hover:text-secondary transition">
            Assign
          </button>
          <button onClick={() => onComplete(project)} className="flex-1 text-xs py-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-500 hover:text-white font-semibold transition">
            Complete
          </button>
          <button onClick={() => onStop(project)} className="flex-1 text-xs py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-500 hover:text-white font-semibold transition">
            Stop
          </button>
        </>
      )}
      {project.status === "pending" && (
        <button onClick={() => onAssign(project)} className="flex-1 text-xs py-2 rounded-lg border border-primary/15 text-primary font-semibold hover:bg-primary hover:text-secondary transition">
          Assign
        </button>
      )}
    </div>
  </div>
);

// --- Main ---
const RunningProjects = () => {
  const { toast, ToastContainer } = useToast();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("all");
  const [stopTarget, setStopTarget] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { data: projData, isLoading } = useQuery({
    queryKey: ["allProjects"],
    queryFn: getProjects,
  });

  const { data: empData } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const { mutate: completeProject, isPending: completePending } = useMutation({
    mutationFn: (id) => updateProjectStatus(id, "completed"),
    onSuccess: () => {
      queryClient.invalidateQueries(["allProjects"]);
      queryClient.invalidateQueries(["dashboard"]);
      toast("success", "Project marked as completed.");
      setCompleteTarget(null);
    },
    onError: (err) => toast("error", err.message || "Failed to complete project."),
  });

  const { mutate: stopProject, isPending: stopPending } = useMutation({
    mutationFn: (id) => updateProjectStatus(id, "stopped"),
    onSuccess: () => {
      queryClient.invalidateQueries(["allProjects"]);
      queryClient.invalidateQueries(["dashboard"]);
      toast("success", "Project stopped.");
      setStopTarget(null);
    },
    onError: (err) => toast("error", err.message || "Failed to stop project."),
  });

  const { mutate: saveAssign, isPending: assignPending } = useMutation({
    mutationFn: ({ id, employees }) => assignEmployees(id, employees),
    onSuccess: () => {
      queryClient.invalidateQueries(["allProjects"]);
      toast("success", "Team updated successfully.");
      setAssignTarget(null);
      setSelectedEmployee(null);
    },
    onError: (err) => toast("error", err.message || "Failed to update team."),
  });

  const handleRemoveEmployee = (project, employee) => {
    const updated = project.employees.filter((e) => e._id !== employee._id).map((e) => e._id);
    saveAssign({ id: project._id, employees: updated });
  };

  const projects = projData?.projects || projData || [];
  const allEmployees = empData?.users || empData || [];
  const filtered = projects.filter((p) => filter === "all" || p.status === filter);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-primary/30 text-sm">Loading projects...</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <ToastContainer />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">Projects</h2>
          <p className="text-primary/60 text-sm mt-1">Track and manage all projects</p>
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
            <ProjectCard key={project._id} project={project} onStop={setStopTarget} onComplete={setCompleteTarget} onAssign={setAssignTarget} onSelectEmployee={(emp, proj) => setSelectedEmployee({ employee: emp, project: proj })} />
          ))}
        </div>
      )}

      {selectedEmployee && <EmployeeModal employee={selectedEmployee.employee} project={selectedEmployee.project} isPending={assignPending} onRemove={handleRemoveEmployee} onClose={() => setSelectedEmployee(null)} />}

      {assignTarget && <AssignModal project={assignTarget} allEmployees={allEmployees} isPending={assignPending} onClose={() => setAssignTarget(null)} onSave={(id, employees) => saveAssign({ id, employees })} />}

      {completeTarget && <ConfirmCompleteModal project={completeTarget} isPending={completePending} onConfirm={completeProject} onClose={() => setCompleteTarget(null)} />}

      {stopTarget && <ConfirmStopModal project={stopTarget} isPending={stopPending} onConfirm={stopProject} onClose={() => setStopTarget(null)} />}
    </div>
  );
};

export default RunningProjects;
