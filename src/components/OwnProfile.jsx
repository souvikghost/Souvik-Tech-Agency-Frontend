import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import useToast from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/user";

const OwnProfile = ({ role = "admin" }) => {
  const { user, login } = useAuth();
  const { toast, ToastContainer } = useToast();
  const isAdmin = role === "admin";

  const [form, setForm]     = useState({ name: user?.name || "", email: user?.email || "" });
  const [preview, setPreview] = useState(null);
  const [error, setError]   = useState("");
  const fileRef = useRef();

  const isDirty = form.name.trim() !== (user?.name || "").trim();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: (data) => {
      login(data.user);
      toast("success", "Profile updated successfully.");
    },
    onError: (err) => toast("error", err.message || "Failed to update profile."),
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) { setError("Image must be under 1MB."); return; }
    setError("");
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    mutate({ name: form.name });
  };

  const initials = form.name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="space-y-4 max-w-2xl">
      <ToastContainer />

      <div>
        <h2 className="text-primary font-display text-2xl font-bold">Profile</h2>
        <p className="text-primary/60 text-sm mt-1">Manage your account details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Avatar */}
        <div className="bg-white border border-primary/8 rounded-2xl p-6 flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-primary text-secondary font-bold text-2xl flex items-center justify-center overflow-hidden ring-4 ring-primary/10">
              {preview
                ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                : initials}
            </div>
            <button type="button" onClick={() => fileRef.current.click()}
              className="absolute border border-white/50 -bottom-1 -right-1 w-7 h-7 bg-primary text-secondary rounded-full flex items-center justify-center text-xs hover:bg-primary/80 transition shadow">
              ✎
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div>
            <p className="text-primary font-bold text-base">{form.name}</p>
            <p className="text-primary/60 italic text-sm mt-0.5">{form.email}</p>
            <p className="text-primary/40 text-xs mt-2">JPG, PNG — max 1MB</p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>

        {/* Fields */}
        <div className="bg-white border border-primary/8 rounded-2xl p-6 space-y-4">
          <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest">General Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-primary text-xs font-semibold block mb-1.5">Full Name</label>
              {isAdmin ? (
                <input name="name" value={form.name} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-primary/15 bg-secondary text-primary text-sm focus:outline-none focus:border-primary/40 transition" />
              ) : (
                <input value={form.name} disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-primary/8 bg-primary/4 text-primary/60 text-sm cursor-not-allowed" />
              )}
            </div>
            <div>
              <label className="text-primary text-xs font-semibold block mb-1.5">Email</label>
              <input value={form.email} disabled
                className="w-full px-3 py-2.5 rounded-xl border border-primary/8 bg-primary/4 text-primary/60 text-sm cursor-not-allowed" />
              <p className="text-primary/40 text-[10px] mt-1">Email cannot be changed</p>
            </div>
          </div>

          {role === "client" && user?.company && (
            <div>
              <label className="text-primary text-xs font-semibold block mb-1.5">Company</label>
              <input value={user.company} disabled
                className="w-full px-3 py-2.5 rounded-xl border border-primary/8 bg-primary/4 text-primary/60 text-sm cursor-not-allowed" />
            </div>
          )}
        </div>

        {/* Role */}
        <div className="bg-white border border-primary/8 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-primary/40 text-xs font-semibold uppercase tracking-widest">Role</p>
            <p className="text-primary font-semibold text-sm mt-1 capitalize">{user?.role || role}</p>
          </div>
          <span className="px-3 py-1 bg-primary/8 text-primary text-xs font-semibold rounded-full capitalize">
            {user?.role || role}
          </span>
        </div>

        {isAdmin && (
          <div className="flex justify-end">
            <button type="submit" disabled={isPending || !isDirty}
              className="px-6 py-2.5 bg-primary text-secondary text-sm font-semibold rounded-lg transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OwnProfile;