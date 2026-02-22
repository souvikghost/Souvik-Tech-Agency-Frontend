import StatCard from "../StatCard";

// --- Static Data ---
const stats = [
  { label: "Total Employees", value: 12 },
  { label: "Total Clients", value: 8 },
  { label: "Total Projects", value: 15 },
  { label: "Total Services", value: 5 },
  { label: "Pending Requests", value: 3 },
  { label: "Ongoing Projects", value: 7 },
];

const recentRequests = [
  { id: 1, client: "ABC Corp", service: "Web Development", status: "pending", date: "21 Feb 2026" },
  { id: 2, client: "XYZ Ltd", service: "SEO Optimization", status: "approved", date: "20 Feb 2026" },
  { id: 3, client: "Acme Inc", service: "UI/UX Design", status: "rejected", date: "19 Feb 2026" },
  { id: 4, client: "Nova Studio", service: "Web Development", status: "pending", date: "18 Feb 2026" },
  { id: 5, client: "Blue Tech", service: "SEO Optimization", status: "approved", date: "17 Feb 2026" },
];

const recentProjects = [
  { id: 1, name: "ABC Corp Website", client: "ABC Corp", status: "in-progress", date: "10 Feb 2026" },
  { id: 2, name: "XYZ SEO Campaign", client: "XYZ Ltd", status: "completed", date: "8 Feb 2026" },
  { id: 3, name: "Acme Dashboard", client: "Acme Inc", status: "pending", date: "5 Feb 2026" },
  { id: 4, name: "Nova Brand Identity", client: "Nova Studio", status: "in-progress", date: "1 Feb 2026" },
];

// --- Status Badge ---
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const StatusBadge = ({ status }) => <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || "bg-primary/10 text-primary"}`}>{status}</span>;

// --- Main ---
const AdminDashboard = () => {
  return (
    <div className="space-y-4">
      {/* Stat Grid */}
      <div className="bg-white border border-primary/8 rounded-2xl grid grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`
        border-primary/8
        ${index % 2 !== 0 ? "border-l" : ""}
        ${index % 3 !== 0 ? "border-l" : ""}
        ${index > 2 ? "border-t" : ""}
        ${index === 3 ? "border-l-0" : ""}
        lg:${index % 3 !== 0 ? "border-l" : ""}
        lg:${index >= 3 ? "border-t" : ""}
      `}
          >
            <StatCard label={stat.label} value={stat.value} />
          </div>
        ))}
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Service Requests */}
        <div className="bg-white border border-primary/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-primary/8">
            <h3 className="text-primary font-semibold text-base">Recent Service Requests</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-primary/60 text-xs uppercase tracking-wide border-b border-primary/8">
                <th className="px-5 py-3 text-left font-semibold">Client</th>
                <th className="px-5 py-3 text-left font-semibold">Service</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <tr key={req.id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
                  <td className="px-5 py-3 font-medium text-primary">{req.client}</td>
                  <td className="px-5 py-3 text-primary/60">{req.service}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-5 py-3 text-primary/60">{req.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Projects */}
        <div className="bg-white border border-primary/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-primary/8">
            <h3 className="text-primary font-semibold text-base">Recent Projects</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-primary/60 text-xs uppercase tracking-wide border-b border-primary/8">
                <th className="px-5 py-3 text-left font-semibold">Project</th>
                <th className="px-5 py-3 text-left font-semibold">Client</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((proj) => (
                <tr key={proj.id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
                  <td className="px-5 py-3 font-medium text-primary">{proj.name}</td>
                  <td className="px-5 py-3 text-primary/60">{proj.client}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={proj.status} />
                  </td>
                  <td className="px-5 py-3 text-primary/60">{proj.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
