import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, updateProjectStatus } from "../../api/projects";
import useToast from "../../hooks/useToast";
import { UpdateStatusModal } from "../modalPopUp/UpdateStatusModal"
import { ProjectCard } from "./ProjectCard";





// --- Main ---
const EmployeeProjects = () => {
  const { toast, ToastContainer } = useToast();
  const queryClient = useQueryClient();
  const [updateTarget, setUpdateTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myProjects"],
    queryFn: getProjects,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, status }) => updateProjectStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["myProjects"]);
      toast("success", "Project status updated.");
      setUpdateTarget(null);
    },
    onError: (err) => {
      toast("error", err.message || "Failed to update status.");
    },
  });

  const projects = data?.projects || data || [];

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-primary/30 text-sm">Loading projects...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-400 text-sm">Failed to load projects.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <ToastContainer />

      <div>
        <h2 className="text-primary font-display text-2xl font-bold">My Projects</h2>
        <p className="text-primary/60 text-sm mt-1">Projects assigned to you</p>
      </div>

      {projects.length === 0 ? (
        <div className="flex items-center justify-center h-40 bg-white border border-primary/8 rounded-2xl">
          <p className="text-primary/30 text-sm">No projects assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onUpdateStatus={setUpdateTarget} />
          ))}
        </div>
      )}

      {updateTarget && <UpdateStatusModal project={updateTarget} isPending={isPending} onClose={() => setUpdateTarget(null)} onUpdate={(id, status) => mutate({ id, status })} />}
    </div>
  );
};

export default EmployeeProjects;
