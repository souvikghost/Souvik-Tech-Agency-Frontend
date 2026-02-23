import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "../../lib/api";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/constants";

const getMyRequests = () => getAPI("/services/requests");


// --- Filter Toggle ---
const filters = ["all", "pending", "approved", "rejected"];

const FilterToggle = ({ active, onChange }) => (
  <div className="flex items-center bg-primary/6 rounded-full p-1 gap-0.5 flex-wrap">
    {filters.map((f) => (
      <button key={f} onClick={() => onChange(f)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${active === f ? "bg-primary text-secondary shadow" : "text-primary/50 hover:text-primary"}`}>
        {f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    ))}
  </div>
);

// --- Request Card ---
const RequestCard = ({ request }) => (
  <div className="bg-white border border-primary/8 rounded-2xl p-5 flex items-start gap-4">
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h4 className="text-primary font-bold text-sm">{request.service?.name || "Service"}</h4>
        <StatusBadge status={request.status} />
      </div>
      {request.note && (
        <p className="text-primary/60 text-sm mt-1 leading-relaxed">"{request.note}"</p>
      )}
      <p className="text-primary/30 tracking-tighter font-mono text-xs mt-2">{formatDate(request.createdAt)}</p>
    </div>
  </div>
);

// --- Main ---
const SubmittedProjectRequest = () => {
  const [filter, setFilter] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myRequests"],
    queryFn: getMyRequests,
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

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">My Requests</h2>
          <p className="text-primary/60 text-sm mt-1">Track your submitted service requests</p>
        </div>
        <FilterToggle active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-40 bg-white border border-primary/8 rounded-2xl">
          <p className="text-primary/30 text-sm">No requests found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((request, index) => (
            <RequestCard key={request._id} request={request} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmittedProjectRequest;