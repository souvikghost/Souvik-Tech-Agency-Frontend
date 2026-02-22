import { useState } from "react";

// --- Static Data ---
const staticRequests = [
  { id: 1, client: "ABC Corp",    service: "Web Development",  note: "Need a full e-commerce website.",     status: "pending",  date: "21 Feb 2026" },
  { id: 2, client: "XYZ Ltd",     service: "SEO Optimization", note: "Want to rank on first page of Google.", status: "pending",  date: "20 Feb 2026" },
  { id: 3, client: "Acme Inc",    service: "UI/UX Design",     note: "Redesign our existing dashboard.",     status: "approved", date: "19 Feb 2026" },
  { id: 4, client: "Nova Studio", service: "Mobile App",       note: "iOS app for our retail business.",     status: "rejected", date: "18 Feb 2026" },
  { id: 5, client: "Blue Tech",   service: "Cloud Hosting",    note: "Migrate our servers to the cloud.",    status: "pending",  date: "17 Feb 2026" },
];

// --- Status Badge ---
const statusStyles = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[status]}`}>
    {status}
  </span>
);

// --- Confirm Modal ---
const ConfirmModal = ({ action, request, onConfirm, onClose }) => (
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
          <p className="text-primary text-xs font-semibold">{request.client}</p>
          <p className="text-primary/50 text-xs">{request.service}</p>
          {request.note && <p className="text-primary/60 text-xs italic">"{request.note}"</p>}
        </div>
        {action === "approve" && (
          <p className="text-primary/60 text-xs">A project will be automatically created upon approval.</p>
        )}
      </div>

      <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">Cancel</button>
        <button onClick={() => onConfirm(request.id, action)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition ${action === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
          Yes, {action}
        </button>
      </div>
    </div>
  </div>
);

// --- Main ---
const ServiceRequest = () => {
  const [confirm, setConfirm] = useState(null); // { action, request }

  const handleConfirm = (id, action) => {
    console.log(action, id);
    setConfirm(null);
  };

  return (
    <div className="space-y-4">

      {/* Page header */}
      <div>
        <h2 className="text-primary font-display text-2xl font-bold">Service Requests</h2>
        <p className="text-primary/60 text-sm mt-1">Review and manage incoming client requests</p>
      </div>

      {/* Table */}
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
            {staticRequests.map((req) => (
              <tr key={req.id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
                <td className="px-5 py-3 font-medium text-primary">{req.client}</td>
                <td className="px-5 py-3 text-primary/60">{req.service}</td>
                <td className="px-5 py-3 text-primary/60 max-w-[180px] truncate">{req.note}</td>
                <td className="px-5 py-3"><StatusBadge status={req.status} /></td>
                <td className="px-5 py-3 text-primary/60">{req.date}</td>
                <td className="px-5 py-3">
                  {req.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConfirm({ action: "approve", request: req })}
                        className="text-xs px-3 py-1 rounded-lg border border-green-200 text-green-600 hover:bg-green-500 hover:text-white font-semibold transition">
                        Approve
                      </button>
                      <button
                        onClick={() => setConfirm({ action: "reject", request: req })}
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

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          action={confirm.action}
          request={confirm.request}
          onConfirm={handleConfirm}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default ServiceRequest;