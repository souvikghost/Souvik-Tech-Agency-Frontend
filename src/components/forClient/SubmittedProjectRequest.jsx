import { useState } from "react";

// --- Static Data ---
const myRequests = [
  { id: 1, service: "Web Development",  note: "Need a full e-commerce website.",      status: "pending",  date: "21 Feb 2026", icon: "🌐" },
  { id: 2, service: "SEO Optimization", note: "Want to rank on first page of Google.", status: "approved", date: "18 Feb 2026", icon: "📈" },
  { id: 3, service: "UI/UX Design",     note: "Redesign our existing dashboard.",      status: "rejected", date: "15 Feb 2026", icon: "🎨" },
  { id: 4, service: "Mobile App",       note: "iOS app for our retail business.",      status: "pending",  date: "10 Feb 2026", icon: "📱" },
];

// --- Status styles ---
const statusStyles = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
};

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[status]}`}>
    {status}
  </span>
);

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
    <div className="w-10 h-10 rounded-lg bg-primary/6 flex items-center justify-center text-xl shrink-0">
      {request.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h4 className="text-primary font-bold text-sm">{request.service}</h4>
        <StatusBadge status={request.status} />
      </div>
      <p className="text-primary/50 text-xs mt-1 leading-relaxed">"{request.note}"</p>
      <p className="text-primary/30 text-[10px] mt-2">{request.date}</p>
    </div>
  </div>
);

// --- Main ---
const SubmittedProjectRequest = () => {
  const [filter, setFilter] = useState("all");

  const filtered = myRequests.filter((r) => filter === "all" || r.status === filter);

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
          {filtered.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmittedProjectRequest;