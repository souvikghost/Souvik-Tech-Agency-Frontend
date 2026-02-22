import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAPI, postAPI } from "../../lib/api";
import useToast from "../../hooks/useToast";
import { ServiceCard } from "./ServiceCard";

const getServices = () => getAPI("/services");
const submitRequest = (body) => postAPI("/services/requests", body);

// --- Request Modal ---
const RequestModal = ({ service, onClose, onSubmit, isPending }) => {
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">Request Service</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-primary/4 rounded-xl p-3">
            <p className="text-primary font-semibold text-sm">{service.name}</p>
            <p className="text-primary/40 text-xs mt-0.5">{service.description}</p>
          </div>
          <div>
            <label className="text-primary text-xs font-semibold block mb-1.5">
              Note <span className="text-primary/40 font-normal">(optional)</span>
            </label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Describe your requirement..." className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
            Cancel
          </button>
          <button onClick={() => onSubmit(service._id, note)} disabled={isPending} className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition disabled:opacity-50">
            {isPending ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main ---
const ListedServices = () => {
  const { toast, ToastContainer } = useToast();
  const [requestTarget, setRequestTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ serviceId, note }) => submitRequest({ service: serviceId, note }),
    onSuccess: () => {
      toast("success", "Service request submitted successfully.");
      setRequestTarget(null);
    },
    onError: (err) => {
      toast("error", err.message || "Failed to submit request.");
    },
  });

  const services = data?.services || data || [];

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-primary/30 text-sm">Loading services...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-400 text-sm">Failed to load services.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <ToastContainer />

      <div>
        <h2 className="text-primary font-display text-2xl font-bold">Services</h2>
        <p className="text-primary/40 text-sm mt-1">Browse and request services</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <ServiceCard key={service._id} service={service} index={index} onRequest={setRequestTarget} />
        ))}
      </div>

      {requestTarget && <RequestModal service={requestTarget} isPending={isPending} onClose={() => setRequestTarget(null)} onSubmit={(serviceId, note) => mutate({ serviceId, note })} />}
    </div>
  );
};

export default ListedServices;
