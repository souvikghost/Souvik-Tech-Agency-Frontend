import { cardStyles } from "../../utils/constants";

// --- Service Card ---
export const ServiceCard = ({ service, index, onRequest }) => {
  const style = cardStyles[index % cardStyles.length];

  return (
    <div className={`bg-gradient-to-br ${style.accent} border ${style.border} rounded-2xl p-6 flex flex-col gap-4`}>

      {/* Top — price badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="shrink-0 bg-white/70 border border-primary/10 rounded-lg px-3 py-1.5 text-right">
          <p className="text-primary/40 text-[9px] font-semibold uppercase tracking-widest leading-none">Starting at</p>
          <p className="text-primary font-bold text-sm font-mono tracking-tighter text-left leading-tight mt-0.5">${service.price?.toLocaleString()}</p>
        </div>
      </div>

      {/* Name + description */}
      <div className="flex-1">
        <h4 className="text-primary font-bold text-lg leading-snug">{service.name}</h4>
        <p className="text-primary/55 text-sm mt-2 leading-relaxed">{service.description}</p>
      </div>

      {/* Footer */}
      <div className="border-t border-primary/8 pt-4">
        <button onClick={() => onRequest(service)}
          className="w-full text-sm py-2.5 rounded-lg bg-primary text-secondary font-semibold hover:bg-primary/90 transition">
          Request Service
        </button>
      </div>
    </div>
  );
};