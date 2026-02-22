const ConfirmDeleteModal = ({ title, description, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">

      <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
        <h3 className="text-primary font-bold text-base">{title}</h3>
        <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">✕</button>
      </div>

      <div className="px-6 py-5 space-y-2">
        <p className="text-primary text-sm">{description}</p>
        <p className="text-primary/40 text-xs">This action cannot be undone.</p>
      </div>

      <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }}
          className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;