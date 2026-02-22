import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "../../lib/api";
import { ProjectCardReadOnly } from "./ProjectCardReadOnly";
import { filters } from "../../utils/constants";

const getMyProjects = () => getAPI("/projects");



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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["clientProjects"],
    queryFn: getMyProjects,
  });

  const projects = data?.projects || data || [];
  const filtered = projects.filter((p) => filter === "all" || p.status === filter);

  if (isLoading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-primary/30 text-sm">Loading projects...</p>
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-red-400 text-sm">Failed to load projects.</p>
    </div>
  );

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">My Projects</h2>
          <p className="text-primary/40 text-sm mt-1">Track your approved projects</p>
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
            <ProjectCardReadOnly key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedProjects;