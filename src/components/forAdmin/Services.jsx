import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices, createService, deleteService } from "../../api/services";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import useToast from "../../hooks/useToast";
import { svgPacket } from "../../utils/svgPacket";
import { formatDate } from "../../utils/constants";

const cardStyles = [
  { accent: "from-blue-50 to-blue-100/50",       border: "border-blue-200/60" },
  { accent: "from-emerald-50 to-emerald-100/50", border: "border-emerald-200/60" },
  { accent: "from-violet-50 to-violet-100/50",   border: "border-violet-200/60" },
  { accent: "from-orange-50 to-orange-100/50",   border: "border-orange-200/60" },
  { accent: "from-cyan-50 to-cyan-100/50",       border: "border-cyan-200/60" },
  { accent: "from-rose-50 to-rose-100/50",       border: "border-rose-200/60" },
];

// --- Service Card ---
const ServiceCard = ({ service, index, onDelete }) => {
  const style = cardStyles[index % cardStyles.length];

  return (
    <div className={`bg-gradient-to-br ${style.accent} border ${style.border} rounded-2xl p-5 flex flex-col gap-4`}>

      {/* Top — name + price badge */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-primary font-bold text-base leading-snug">{service.name}</h4>
        <div className="shrink-0 bg-white/70 border border-primary/10 rounded-xl px-3 py-1.5 text-right">
          <p className="text-primary/40 text-[9px] font-semibold uppercase tracking-widest leading-none">From</p>
          <p className="text-primary font-bold font-mono text-sm leading-tight tracking-tighter mt-0.5">${service.price?.toLocaleString()}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-primary/60 text-sm leading-relaxed flex-1">{service.description}</p>

      {/* Footer */}
      <div className="border-t border-primary/8 pt-3 flex items-center justify-between gap-3">
        <p className="text-primary/30 font-mono text-[11px]">Added {formatDate(service.createdAt)}</p>
        <button onClick={() => onDelete(service)}
          className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition shrink-0">
          Delete
        </button>
      </div>
    </div>
  );
};

// --- Add Modal ---
const ServiceModal = ({ onClose, onSave, isPending }) => {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) return;
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">Add Service</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-primary text-xs font-semibold block mb-1">Service Name <span className="text-red-400">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Web Development"
              className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
          </div>
          <div>
            <label className="text-primary text-xs font-semibold block mb-1">
              Starting Price <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center border border-primary/15 rounded-lg bg-white overflow-hidden focus-within:border-primary/40 transition">
              <span className="px-3 py-2 text-sm text-primary/50 font-semibold border-r border-primary/10 bg-primary/4 shrink-0">$</span>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="2999"
                className="flex-1 px-3 py-2 text-sm text-primary placeholder:text-primary/30 focus:outline-none bg-transparent" />
            </div>
          </div>
          <div>
            <label className="text-primary text-xs font-semibold block mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description..."
              className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">Cancel</button>
          <button onClick={handleSave} disabled={isPending}
            className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition disabled:opacity-50">
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main ---
const Services = () => {
  const { toast, ToastContainer } = useToast();
  const queryClient = useQueryClient();
  const [showAdd,      setShowAdd]      = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminServices"],
    queryFn: getServices,
  });

  const { mutate: addService, isPending: addPending } = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminServices"]);
      toast("success", "Service created successfully.");
      setShowAdd(false);
    },
    onError: (err) => toast("error", err.message || "Failed to create service."),
  });

  const { mutate: removeService } = useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminServices"]);
      toast("success", "Service deleted successfully.");
      setDeleteTarget(null);
    },
    onError: (err) => toast("error", err.message || "Failed to delete service."),
  });

  const services = data?.services || data || [];

  if (isLoading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-primary/30 text-sm">Loading services...</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <ToastContainer />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">Services</h2>
          <p className="text-primary/60 text-sm mt-1">Manage services your company offers</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-primary flex justify-center items-center gap-1 text-secondary text-sm font-semibold rounded-lg transition">
          {svgPacket["plusIcon"]} Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="flex items-center justify-center h-40 bg-white border border-primary/8 rounded-2xl">
          <p className="text-primary/30 text-sm">No services yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {showAdd && <ServiceModal isPending={addPending} onClose={() => setShowAdd(false)} onSave={addService} />}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Delete Service"
          description={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={() => removeService(deleteTarget._id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Services;