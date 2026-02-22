// --- Update Status Modal ---

import { useState } from "react";

export const UpdateStatusModal = ({ project, onClose, onUpdate, isPending }) => {
  const options = ["in-progress", "completed"];
  const [selected, setSelected] = useState(project.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">Update Status</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest">Project</p>
          <p className="text-primary font-semibold text-sm">{project.name}</p>
          <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest mt-3">Select Status</p>
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <button key={opt} onClick={() => setSelected(opt)} className={`w-full px-4 py-2.5 rounded-lg border text-sm font-semibold capitalize text-left transition ${selected === opt ? "bg-primary text-secondary border-primary" : "border-primary/15 text-primary/60 hover:border-primary/40"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
            Cancel
          </button>
          <button onClick={() => onUpdate(project._id, selected)} disabled={isPending} className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition disabled:opacity-50">
            {isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};