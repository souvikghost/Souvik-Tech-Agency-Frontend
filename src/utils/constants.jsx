export const getInitials = (name) =>
  name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const statusStyles = {
  // project statuses
  "in-progress": "bg-blue-100 text-blue-700",
  completed:     "bg-emerald-100 text-emerald-700",
  stopped:       "bg-red-100 text-red-600",
  // request statuses
  pending:       "bg-yellow-100 text-yellow-700",
  approved:      "bg-green-100 text-green-700",
  rejected:      "bg-red-100 text-red-600",
};

// --- Filter Toggle ---
export const filters = ["all", "in-progress", "completed", "stopped"];

// Static accent/border per index since backend doesn't have these
export const cardStyles = [
  { accent: "from-blue-50 to-blue-100/50",       border: "border-blue-200/60" },
  { accent: "from-emerald-50 to-emerald-100/50", border: "border-emerald-200/60" },
  { accent: "from-violet-50 to-violet-100/50",   border: "border-violet-200/60" },
  { accent: "from-orange-50 to-orange-100/50",   border: "border-orange-200/60" },
  { accent: "from-cyan-50 to-cyan-100/50",       border: "border-cyan-200/60" },
  { accent: "from-rose-50 to-rose-100/50",       border: "border-rose-200/60" },
];

export const icons = ["🌐", "📈", "🎨", "📱", "☁️", "✦", "🛠", "📦"];