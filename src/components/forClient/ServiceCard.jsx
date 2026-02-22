import { cardStyles, icons } from "../../utils/constants";

// --- Service Card ---
export const ServiceCard = ({ service, index, onRequest }) => {
  const style = cardStyles[index % cardStyles.length];
  const icon  = icons[index % icons?.length];

  return (
    <div className={`bg-gradient-to-br ${style.accent} border ${style.border} rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm">{icon}</div>
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
};