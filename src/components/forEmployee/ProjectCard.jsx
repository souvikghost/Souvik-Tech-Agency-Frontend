// --- Project Card ---

import { formatDate, getInitials } from "../../utils/constants";
import StatusBadge from "../StatusBadge";

export const ProjectCard = ({ project, onUpdateStatus }) => (
  <div className="bg-white border border-primary/8 rounded-2xl p-5 flex flex-col gap-4">
    <div className="flex items-start justify-between gap-2">
      <div>
        <h4 className="text-primary font-bold text-sm">{project.name}</h4>
        <p className="text-primary/60 text-xs mt-0.5">{project.client?.name}</p>
      </div>
      <StatusBadge status={project.status} />
    </div>

    <p className="text-primary/50 text-xs flex-1 leading-relaxed">{project.description}</p>

    <div className="grid grid-cols-2 gap-2">
      <div className="bg-primary/4 rounded-lg px-3 py-2">
        <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest">Started</p>
        <p className="text-primary text-xs font-semibold mt-0.5">{formatDate(project.createdAt)}</p>
      </div>
      <div className="bg-primary/4 rounded-lg px-3 py-2">
        <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest">Company</p>
        <p className="text-primary text-xs font-semibold mt-0.5">{project.client?.company || "—"}</p>
      </div>
    </div>

    {project.employees?.length > 0 && (
      <div>
        <p className="text-primary/60 text-[10px] font-semibold uppercase tracking-widest mb-2">Teammates</p>
        <div className="flex items-center -space-x-2">
          {project.employees.map((emp) => (
            <div key={emp._id} title={emp.name} className="w-7 h-7 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {getInitials(emp.name)}
            </div>
          ))}
        </div>
      </div>
    )}

    {project.status !== "completed" && project.status !== "stopped" ? (
      <button onClick={() => onUpdateStatus(project)} className="w-full text-xs py-2 rounded-lg border border-primary/15 text-primary font-semibold hover:bg-primary hover:text-secondary transition">
        Update Status
      </button>
    ) : (
      <button disabled className={`w-full text-xs py-2 rounded-lg border font-semibold cursor-not-allowed! opacity-60 ${project.status === "stopped" ? "border-red-200 text-red-400" : "border-emerald-200 text-emerald-500"}`}>
        {project.status === "stopped" ? "Project Stopped" : "Completed"}
      </button>
    )}
  </div>
);
