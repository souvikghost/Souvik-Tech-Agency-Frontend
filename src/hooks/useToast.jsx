import { useState } from "react";
import { svgPacket } from "../utils/svgPacket";

const toastStyles = {
  success: "bg-emerald-100 border-emerald-400 text-emerald-800",
  error:   "bg-red-100 border-red-400 text-red-800",
  warning: "bg-yellow-100 border-yellow-400 text-yellow-800",
  info:    "bg-blue-100 border-blue-400 text-blue-800",
};

const iconStyles = {
  success: "bg-emerald-100 text-emerald-600",
  error:   "bg-red-100 text-red-500",
  warning: "bg-yellow-100 text-yellow-600",
  info:    "bg-blue-100 text-blue-600",
};

const icons = {
  success: svgPacket["successIcon"],
  error:   svgPacket["errorIcon"],
  warning: svgPacket["warningIcon"],
  info:    svgPacket["infoIcon"],
};

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = (type, message, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  };

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const ToastContainer = () => (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg w-72 ${toastStyles[t.type]}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${iconStyles[t.type]}`}>
            {icons[t.type]}
          </div>
          <p className="text-sm flex-1">{t.message}</p>
          <button onClick={() => remove(t.id)} className="opacity-40 hover:opacity-80 transition text-sm shrink-0">✕</button>
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

export default useToast;