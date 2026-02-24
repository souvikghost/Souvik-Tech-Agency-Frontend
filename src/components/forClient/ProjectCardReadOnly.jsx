import { useQuery } from "@tanstack/react-query";
import { formatDate, getInitials } from "../../utils/constants";
import StatusBadge from "../StatusBadge";
import { getPaymentByProject } from "../../api/payment";

const paymentStatusStyle = {
  paid:    "bg-emerald-50 text-emerald-600 border-emerald-200",
  unpaid:  "bg-red-50 text-red-500 border-red-200",
  partial: "bg-amber-50 text-amber-600 border-amber-200",
};

// --- Project Card (read only) ---
export const ProjectCardReadOnly = ({ project }) => {
  const { data: payment } = useQuery({
    queryKey: ["payment", project._id],
    queryFn: () => getPaymentByProject(project._id),
    retry: false,
  });
  const validPayment = payment?._id ? payment : null; 

  return (
    <div className="bg-white border border-primary/8 rounded-2xl p-5 flex flex-col gap-4">

      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-primary font-bold text-sm">{project.name}</h4>
          <p className="text-primary/40 text-xs mt-0.5">{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-primary/4 rounded-lg px-3 py-2">
          <p className="text-primary/40 text-[10px] font-semibold uppercase tracking-widest">Started</p>
          <p className="text-primary/30 tracking-tighter font-mono text-xs mt-0.5">{formatDate(project.createdAt)}</p>
        </div>
        {(project.status === "completed" || project.status === "stopped") && (
          <div className={`rounded-lg px-3 py-2 ${project.status === "completed" ? "bg-emerald-50" : "bg-red-50"}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${project.status === "completed" ? "text-emerald-500" : "text-red-400"}`}>
              {project.status === "completed" ? "Completed" : "Stopped"}
            </p>
            <p className={`tracking-tighter font-mono text-xs mt-0.5 ${project.status === "completed" ? "text-emerald-600" : "text-red-500"}`}>
              {formatDate(project.updatedAt)}
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="text-primary/40 text-[10px] font-semibold uppercase tracking-widest mb-2">Assigned Team</p>
        {project.employees?.length > 0 ? (
          <div className="flex items-center -space-x-2">
            {project.employees.map((emp) => (
              <div key={emp._id} title={emp.name}
                className="w-7 h-7 rounded-full bg-primary text-secondary text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {getInitials(emp.name)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-primary/30 text-xs">No team assigned yet</p>
        )}
      </div>

      {/* Payment Status — only shows if admin has added a payment record */}
      {validPayment && (
        <div className={`border rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 ${paymentStatusStyle[payment.status]}`}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60">Payment</p>
            <p className="text-sm font-bold mt-0.5">${payment.amount?.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest capitalize">{payment.status}</span>
            {payment.date && (
              <p className="text-[10px] opacity-60 mt-0.5 font-mono">{formatDate(payment.date)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};