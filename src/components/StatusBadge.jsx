import { statusStyles } from "../utils/constants";

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || "bg-primary/10 text-primary"}`}>
    {status}
  </span>
);

export default StatusBadge;