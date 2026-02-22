import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequests, approveRequest, rejectRequest } from "../../api/requests";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/constants";
import useToast from "../../hooks/useToast";

// --- Filter Toggle ---
const filters = ["all", "pending", "approved", "rejected"];

const FilterToggle = ({ active, onChange }) => (
  <div className="flex items-center bg-primary/6 rounded-full p-1 gap-0.5">
    {filters.map((f) => (
      <button key={f} onClick={() => onChange(f)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${active === f ? "bg-primary text-secondary shadow" : "text-primary/50 hover:text-primary"}`}>
        {f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    ))}
  </div>
);

// --- Confirm Modal ---
const ConfirmModal = ({ action, request, onConfirm, onClose, isPending }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">
      <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
        <h3 className="text-primary font-bold text-base capitalize">{action} Request</h3>
        <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">✕</button>
      </div>
      <div className="px-6 py-5 space-y-2">
        <p className="text-primary text-sm">
          Are you sure you want to <span className={`font-bold ${action === "approve" ? "text-green-600" : "text-red-500"}`}>{action}</span> this request?
        </p>
        <div className="bg-primary/4 rounded-xl p-3 space-y-1">
          <p className="text-primary text-xs font-semibold">{request.client?.name}</p>
          <p className="text-primary/50 text-xs">{request.service?.name}</p>
          {request.note && <p className="text-primary/60 text-xs italic">"{request.note}"</p>}
        </div>
        {action === "approve" && (
          <p className="text-primary/40 text-xs">A project will be automatically created upon approval.</p>
        )}
      </div>
      <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">Cancel</button>
        <button onClick={() => onConfirm(request._id, action)} disabled={isPending}
          className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition disabled:opacity-50 ${action === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
          {isPending ? "Processing..." : `Yes, ${action}`}
        </button>
      </div>
    </div>
  </div>
);

// --- Main ---
const ServiceRequest = () => {
  const { toast, ToastContainer } = useToast();
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState(null);
  const [filter, setFilter]   = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allRequests"],
    queryFn: getRequests,
  });

  const { mutate: handleAction, isPending } = useMutation({
    mutationFn: ({ id, action }) => action === "approve" ? approveRequest(id) : rejectRequest(id),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries(["allRequests"]);
      queryClient.invalidateQueries(["dashboard"]);
      toast("success", `Request ${action}d successfully.`);
      setConfirm(null);
    },
    onError: (err) => toast("error", err.message || "Failed to process request."),
  });

  const requests = data?.requests || data || [];
  const filtered = requests.filter((r) => filter === "all" || r.status === filter);

  if (isLoading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-primary/30 text-sm">Loading requests...</p>
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-red-400 text-sm">Failed to load requests.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <ToastContainer />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">Service Requests</h2>
          <p className="text-primary/60 text-sm mt-1">Review and manage incoming client requests</p>
        </div>
        <FilterToggle active={filter} onChange={setFilter} />
      </div>

      <div className="bg-white border border-primary/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/8 text-xs uppercase tracking-wide text-primary/60">
              <th className="px-5 py-3 text-left font-semibold">Client</th>
              <th className="px-5 py-3 text-left font-semibold">Service</th>
              <th className="px-5 py-3 text-left font-semibold">Note</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Date</th>
              <th className="px-5 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-primary/30 text-xs">No requests found.</td></tr>
            ) : filtered.map((req) => (
              <tr key={req._id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
                <td className="px-5 py-3 font-medium text-primary">{req.client?.name || "—"}</td>
                <td className="px-5 py-3 text-primary/60">{req.service?.name || "—"}</td>
                <td className="px-5 py-3 text-primary/60 max-w-[180px] truncate">{req.note || "—"}</td>
                <td className="px-5 py-3"><StatusBadge status={req.status} /></td>
                <td className="px-5 py-3 text-primary/60">{formatDate(req.createdAt)}</td>
                <td className="px-5 py-3">
                  {req.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfirm({ action: "approve", request: req })}
                        className="text-xs px-3 py-1 rounded-lg border border-green-200 text-green-600 hover:bg-green-500 hover:text-white font-semibold transition">
                        Approve
                      </button>
                      <button onClick={() => setConfirm({ action: "reject", request: req })}
                        className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-500 hover:text-white font-semibold transition">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-primary/30 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm && (
        <ConfirmModal
          action={confirm.action}
          request={confirm.request}
          isPending={isPending}
          onConfirm={(id, action) => handleAction({ id, action })}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default ServiceRequest;