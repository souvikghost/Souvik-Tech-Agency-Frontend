import { useQuery } from "@tanstack/react-query";
import StatCard from "../StatCard";
import { formatDate } from "../../utils/constants";
import StatusBadge from "../StatusBadge";
import { getProjects } from "../../api/projects";
import { getRequests } from "../../api/requests";
import { getDashboard } from "../../api/dashboard";

const AdminDashboard = () => {
  const { data: dashData } = useQuery({ queryKey: ["dashboard"],   queryFn: getDashboard });
  const { data: reqData }  = useQuery({ queryKey: ["allRequests"], queryFn: getRequests });
  const { data: projData } = useQuery({ queryKey: ["allProjects"], queryFn: getProjects });

  const ongoingCount = dashData?.projectsByStatus?.find((s) => s._id === "in-progress")?.count || 0;

  const stats = [
    { label: "Total Employees",  value: dashData?.totalEmployees  ?? "--" },
    { label: "Total Clients",    value: dashData?.totalClients    ?? "--" },
    { label: "Total Projects",   value: dashData?.totalProjects   ?? "--" },
    { label: "Total Services",   value: dashData?.totalServices   ?? "--" },
    { label: "Pending Requests", value: dashData?.pendingRequests ?? "--" },
    { label: "Ongoing Projects", value: ongoingCount },
  ];

  const requests = (reqData?.requests || reqData || []).slice(0, 5);
  const projects  = (projData?.projects || projData || []).slice(0, 4);

  return (
    <div className="space-y-4">

      {/* Stat Grid */}
      <div className="bg-white border border-primary/8 rounded-2xl grid grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={stat.label} className={`border-primary/8
            ${index % 2 !== 0 ? "border-l" : ""}
            ${index > 2 ? "border-t" : ""}
            lg:${index % 3 !== 0 ? "border-l" : ""}
            lg:${index >= 3 ? "border-t" : ""}
          `}>
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
              {requests.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-6 text-center text-primary/30 text-xs">No requests yet.</td></tr>
              ) : requests.map((req) => (
                <tr key={req._id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
                  <td className="px-5 py-3 font-medium text-primary">{req.client?.name || "—"}</td>
                  <td className="px-5 py-3 text-primary/60">{req.service?.name || "—"}</td>
                  <td className="px-5 py-3"><StatusBadge status={req.status} /></td>
                  <td className="px-5 py-3 text-primary/60">{formatDate(req.createdAt)}</td>
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
              {projects.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-6 text-center text-primary/30 text-xs">No projects yet.</td></tr>
              ) : projects.map((proj) => (
                <tr key={proj._id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
                  <td className="px-5 py-3 font-medium text-primary">{proj.name}</td>
                  <td className="px-5 py-3 text-primary/60">{proj.client?.name || "—"}</td>
                  <td className="px-5 py-3"><StatusBadge status={proj.status} /></td>
                  <td className="px-5 py-3 text-primary/60">{formatDate(proj.createdAt)}</td>
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