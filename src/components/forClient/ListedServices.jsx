import { useState } from "react";
import useToast from "../../hooks/useToast";

// --- Static Data ---
const staticServices = [
  { id: 1, name: "Web Development",  description: "Custom web applications built from scratch.",           icon: "🌐", accent: "from-blue-50 to-blue-100/50",    border: "border-blue-200/60" },
  { id: 2, name: "SEO Optimization", description: "Rank higher on search engines and drive traffic.",      icon: "📈", accent: "from-emerald-50 to-emerald-100/50", border: "border-emerald-200/60" },
  { id: 3, name: "UI/UX Design",     description: "Beautiful, intuitive interfaces your users will love.", icon: "🎨", accent: "from-violet-50 to-violet-100/50",  border: "border-violet-200/60" },
  { id: 4, name: "Mobile App",       description: "iOS and Android apps built with modern frameworks.",    icon: "📱", accent: "from-orange-50 to-orange-100/50", border: "border-orange-200/60" },
  { id: 5, name: "Cloud Hosting",    description: "Reliable, scalable cloud infrastructure setup.",        icon: "☁️", accent: "from-cyan-50 to-cyan-100/50",    border: "border-cyan-200/60" },
  { id: 6, name: "Brand Identity",   description: "Logo, typography, and full brand guidelines.",          icon: "✦",  accent: "from-rose-50 to-rose-100/50",    border: "border-rose-200/60" },
];

// --- Request Modal ---
const RequestModal = ({ service, onClose, onSubmit }) => {
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">Request Service</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3 bg-primary/4 rounded-xl p-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <p className="text-primary font-semibold text-sm">{service.name}</p>
              <p className="text-primary/40 text-xs">{service.description}</p>
            </div>
          </div>
          <div>
            <label className="text-primary text-xs font-semibold block mb-1.5">Note <span className="text-primary/40 font-normal">(optional)</span></label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
              placeholder="Describe your requirement..."
              className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">Cancel</button>
          <button onClick={() => { onSubmit(service.id, note); onClose(); }}
            className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Service Card ---
const ServiceCard = ({ service, onRequest }) => (
  <div className={`bg-gradient-to-br ${service.accent} border ${service.border} rounded-2xl p-5 flex flex-col gap-3`}>
    <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm">{service.icon}</div>
    <div className="flex-1">
      <h4 className="text-primary font-bold text-base">{service.name}</h4>
      <p className="text-primary/60 text-sm mt-1 leading-relaxed">{service.description}</p>
    </div>
    <button onClick={() => onRequest(service)}
      className="w-full text-xs py-2 rounded-lg bg-primary text-secondary font-semibold hover:bg-primary/90 transition">
      Request
    </button>
  </div>
);

// --- Main ---
const ListedServices = () => {
  const { toast, ToastContainer } = useToast();
  const [requestTarget, setRequestTarget] = useState(null);

  const handleSubmit = (serviceId, note) => {
    console.log("Request service", serviceId, note);
    toast("success", "Service request submitted successfully.");
  };

  return (
    <div className="space-y-4">
      <ToastContainer />

      <div>
        <h2 className="text-primary font-display text-2xl font-bold">Services</h2>
        <p className="text-primary/40 text-sm mt-1">Browse and request services</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staticServices.map((service) => (
          <ServiceCard key={service.id} service={service} onRequest={setRequestTarget} />
        ))}
      </div>

      {requestTarget && (
        <RequestModal
          service={requestTarget}
          onClose={() => setRequestTarget(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ListedServices;