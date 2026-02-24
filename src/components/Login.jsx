import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const loginRequest = ({ email, password }) => postAPI("/auth/login", { email, password });

const roleRedirect = {
  admin: "/admin/dashboard",
  employee: "/employee/projects",
  client: "/client/services",
};

const demoCredentials = [{ role: "Admin", email: "admin@souviktechagency.com", password: "abcd" }];

const HelpButton = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Credentials Box */}
      {open && (
        <div className="bg-white border border-primary/10 rounded-2xl shadow-2xl p-4 w-68">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Demo Credentials</p>
          <div className="space-y-3">
            {demoCredentials.map((c) => (
              <div key={c.role} className="bg-primary/4 rounded-xl px-3 py-2.5 space-y-1">
                <p className="text-primary text-sm font-bold">{c.role}</p>
                <p className="text-primary/50 text-xs font-semibold select-all cursor-text break-all">{c.email}</p>
                <p className="text-primary/50 text-xs">
                  Password: <span className="font-semibold text-primary/50 select-all cursor-text">{c.password}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-primary/60 text-[10px] mt-3 text-center">Click on text to select &amp; copy</p>
        </div>
      )}

      {/* Pill Button */}
      <button type="button" onClick={() => setOpen((p) => !p)} className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary text-xs font-semibold rounded-full shadow-lg hover:bg-primary/90 transition">
        <span className="w-4 h-4 rounded-full border border-secondary/50 flex items-center justify-center text-[10px] font-bold">i</span>
        Help
      </button>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.user);
      navigate(roleRedirect[data.user.role] || "/login");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center flex flex-col justify-center items-center">
          <div className="px-5 py-2">
            <img src="/assets/Souvik Tech Agency Secondary Logo.svg" alt="Souvik Tech Agency" className="max-h-28 w-auto object-contain" />
          </div>
          <p className="text-primary/40 text-sm font-semibold mt-3">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-primary text-sm font-semibold block mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white font-semibold text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
          </div>

          <div>
            <label className="text-primary text-sm font-semibold block mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-primary/15 font-semibold bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
          </div>

          {error && <p className="text-red-500 text-sm">{error.message}</p>}

          <button type="submit" disabled={isPending} className="w-full py-2.5 bg-primary text-secondary text-sm font-semibold rounded-xl transition disabled:opacity-50">
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <HelpButton />
    </div>
  );
};

export default Login;
