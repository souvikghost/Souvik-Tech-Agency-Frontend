import { useState } from "react";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

// --- Static Data ---
const staticServices = [
  { id: 1, name: "Web Development",  description: "Custom web applications built from scratch.",           icon: "🌐", accent: "from-blue-50 to-blue-100/50",    border: "border-blue-200/60" },
  { id: 2, name: "SEO Optimization", description: "Rank higher on search engines and drive traffic.",      icon: "📈", accent: "from-emerald-50 to-emerald-100/50", border: "border-emerald-200/60" },
  { id: 3, name: "UI/UX Design",     description: "Beautiful, intuitive interfaces your users will love.", icon: "🎨", accent: "from-violet-50 to-violet-100/50",  border: "border-violet-200/60" },
  { id: 4, name: "Mobile App",       description: "iOS and Android apps built with modern frameworks.",    icon: "📱", accent: "from-orange-50 to-orange-100/50", border: "border-orange-200/60" },
  { id: 5, name: "Cloud Hosting",    description: "Reliable, scalable cloud infrastructure setup.",        icon: "☁️", accent: "from-cyan-50 to-cyan-100/50",    border: "border-cyan-200/60" },
  { id: 6, name: "Brand Identity",   description: "Logo, typography, and full brand guidelines.",          icon: "✦",  accent: "from-rose-50 to-rose-100/50",    border: "border-rose-200/60" },
];

// --- Service Card ---
const ServiceCard = ({ service, onEdit, onDelete }) => (
  <div className={`bg-gradient-to-br ${service.accent} border ${service.border} rounded-2xl p-5 flex flex-col gap-3`}>
    <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm">{service.icon}</div>
    <div className="flex-1">
      <h4 className="text-primary font-bold text-base">{service.name}</h4>
      <p className="text-primary/60 text-sm mt-1 leading-relaxed">{service.description}</p>
    </div>
    <div className="flex items-center gap-2 pt-2">
      <button onClick={() => onEdit(service)} className="flex-1 text-xs py-1.5 rounded-lg border border-primary/15 text-primary font-semibold hover:bg-primary hover:text-secondary transition">
        Edit
      </button>
      <button onClick={() => onDelete(service)} className="flex-1 text-xs py-1.5 rounded-lg border border-red-200 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition">
        Delete
      </button>
    </div>
  </div>
);

// --- Add / Edit Modal ---
const ServiceModal = ({ service, onClose, onSave }) => {
  const isEdit = !!service;
  const [form, setForm] = useState({
    name:        service?.name        || "",
    description: service?.description || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ ...service, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">{isEdit ? "Edit Service" : "Add Service"}</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-primary text-xs font-semibold block mb-1">Service Name <span className="text-red-400">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Web Development"
              className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
          </div>
          <div>
            <label className="text-primary text-xs font-semibold block mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description..."
              className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition">
            {isEdit ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main ---
const Services = () => {
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd,      setShowAdd]      = useState(false);

  const handleSave          = (updated) => console.log("Save service", updated);
  const handleConfirmDelete = (id)      => console.log("Delete service", id);

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">Services</h2>
          <p className="text-primary/60 text-sm mt-1">Manage services your company offers</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-primary text-secondary text-sm font-semibold rounded-lg transition">
          + Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staticServices.map((service) => (
          <ServiceCard key={service.id} service={service} onEdit={setEditTarget} onDelete={setDeleteTarget} />
        ))}
      </div>

      {showAdd && (
        <ServiceModal onClose={() => setShowAdd(false)} onSave={handleSave} />
      )}

      {editTarget && (
        <ServiceModal service={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Delete Service"
          description={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={() => handleConfirmDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Services;