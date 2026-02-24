import { useQuery } from "@tanstack/react-query";
import StatCard from "../StatCard";
import { formatDate } from "../../utils/constants";
import StatusBadge from "../StatusBadge";
import { getProjects } from "../../api/projects";
import { getRequests } from "../../api/requests";
import { getDashboard } from "../../api/dashboard";
import { getPayments, getPaymentStats } from "../../api/payment";

const paymentStatusStyle = {
  paid: "bg-emerald-100 text-emerald-600",
  unpaid: "bg-red-100 text-red-500",
  partial: "bg-amber-100 text-amber-600",
};

const AdminDashboard = () => {
  const { data: dashData } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboard });
  const { data: reqData } = useQuery({ queryKey: ["allRequests"], queryFn: getRequests });
  const { data: projData } = useQuery({ queryKey: ["allProjects"], queryFn: getProjects });
  const { data: paymentStats } = useQuery({ queryKey: ["paymentStats"], queryFn: getPaymentStats });
  const { data: paymentsData } = useQuery({ queryKey: ["payments"], queryFn: getPayments });

  const ongoingCount = dashData?.projectsByStatus?.find((s) => s._id === "in-progress")?.count || 0;

  const stats = [
    { label: "Total Employees", value: dashData?.totalEmployees ?? "--" },
    { label: "Total Clients", value: dashData?.totalClients ?? "--" },
    { label: "Total Projects", value: dashData?.totalProjects ?? "--" },
    { label: "Total Services", value: dashData?.totalServices ?? "--" },
    { label: "Pending Requests", value: dashData?.pendingRequests ?? "--" },
    { label: "Ongoing Projects", value: ongoingCount },
  ];

  const requests = (reqData?.requests || reqData || []).slice(0, 5);
  const projects = (projData?.projects || projData || []).slice(0, 4);
  const payments = paymentsData || [];

  const totalRevenue = paymentStats?.totalRevenue || 0;
  const totalPending = paymentStats?.totalPending || 0;
  const totalPartial = paymentStats?.totalPartial || 0;

  return (
    <div className="space-y-4">
      {/* Stat Grid */}
      {/* <div className="bg-white border border-primary/8 rounded-2xl grid grid-cols-2 lg:grid-cols-3"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06)] border-primary/8 rounded-2xl overflow-hidden">
              <StatCard label={stat.label} value={stat.value} />
            </div>
          ))}
        {/* </div> */}
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
          <p className="text-emerald-600 text-xs sm:text-sm  font-bold uppercase tracking-wide">Total Collected</p>
          <p className="text-emerald-700 font-bold text-2xl font-mono tracking-tighter mt-1">${totalRevenue.toLocaleString()}</p>
          <p className="text-emerald-500 text-xs mt-1">From paid invoices</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <p className="text-amber-600  text-xs sm:text-sm  font-bold uppercase tracking-wide">Partial Payments</p>
          <p className="text-amber-700 font-bold text-2xl font-mono tracking-tighter mt-1">${totalPartial.toLocaleString()}</p>
          <p className="text-amber-500 text-xs mt-1">Partially collected</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <p className="text-red-500  text-xs sm:text-sm  font-bold uppercase tracking-wide">Outstanding</p>
          <p className="text-red-600 font-bold text-2xl font-mono tracking-tighter mt-1">${totalPending.toLocaleString()}</p>
          <p className="text-red-400 text-xs mt-1">Unpaid invoices</p>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className=" bg-primary/10 border border-primary/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-primary/8">
          <h3 className="text-primary text-xs sm:text-sm  font-bold uppercase tracking-wide">Payment Records</h3>
          <p className="text-primary/60 text-xs mt-0.5">All project payment details</p>
        </div>
        <table className="w-full text-sm bg-secondary">
          <thead>
            <tr className="text-primary/60 text-xs uppercase tracking-wide border-b border-primary/8">
              <th className="px-5 py-3 text-left font-semibold">Project</th>
              <th className="px-5 py-3 text-left font-semibold">Client</th>
              <th className="px-5 py-3 text-left font-semibold">Amount</th>
              <th className="px-5 py-3 text-left font-semibold">Method</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center  text-primary/30 text-xs">
                  No payment records yet.
                </td>
              </tr>
            ) : (
              payments.map((pay) => (
                <tr key={pay._id} className="border-b border-primary/5  last:border-0 hover:bg-primary/2 transition">
                  <td className="px-5 py-3 font-medium text-primary">{pay.project?.name || "—"}</td>
                  <td className="px-5 py-3 text-primary/60">{pay.client?.name || "—"}</td>
                  <td className="px-5 py-3 text-primary font-semibold font-mono">${pay.amount?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-primary/60 capitalize">{pay.method?.replace("_", " ") || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${paymentStatusStyle[pay.status]}`}>{pay.status}</span>
                  </td>
                  <td className="px-5 py-3 text-primary/30 tracking-tighter font-mono text-xs">{formatDate(pay.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Service Requests */}
        <div className="bg-primary/10 border border-primary/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-primary/8">
            <h3 className="text-primary text-xs sm:text-sm  font-bold uppercase tracking-wide">Recent Service Requests</h3>
          </div>
          <table className="w-full text-sm bg-secondary">
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
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-primary/30 text-xs">
                    No requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id} className="border-b  border-primary/5 last:border-0 hover:bg-primary/2 transition">
                    <td className="px-5 py-3 font-medium text-primary">{req.client?.name || "—"}</td>
                    <td className="px-5 py-3 text-primary/60">{req.service?.name || "—"}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-3 text-primary/30 tracking-tighter font-mono text-xs">{formatDate(req.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Projects */}
        <div className="bg-primary/10 border border-primary/8 rounded-2xl  overflow-hidden">
          <div className="px-5 py-4 border-b border-primary/8">
            <h3 className="text-primary text-xs sm:text-sm  font-bold uppercase tracking-wide">Recent Projects</h3>
          </div>
          <table className="w-full text-sm bg-secondary h-full ">
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
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-primary/30 text-xs">
                    No projects yet.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
                    <td className="px-5 py-3 font-medium text-primary">{proj.name}</td>
                    <td className="px-5 py-3 text-primary/60">{proj.client?.name || "—"}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={proj.status} />
                    </td>
                    <td className="px-5 py-3 text-primary/30 tracking-tighter font-mono text-xs">{formatDate(proj.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
