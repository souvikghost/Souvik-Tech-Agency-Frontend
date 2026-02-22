import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {postAPI} from "../lib/api"

const loginRequest = ({ email, password }) => postAPI("/auth/login", { email, password });


const roleRedirect = {
  admin: "/admin/dashboard",
  employee: "/employee/projects",
  client: "/client/services",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { login } = useAuth();
  // const navigate = useNavigate();

  // const { mutate, isPending, error } = useMutation({
  //   mutationFn: loginRequest,
  //   onSuccess: (data) => {
  //     login(data.user);
  //     navigate(roleRedirect[data.user.role] || "/");
  //   },
  // });

  const handleSubmit = (e) => {
    e.preventDefault();
    // mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-primary text-3xl font-bold leading-tight">
            Souvik <br />
            <span className="bg-primary text-secondary px-2 rounded-sm">Tech Agency</span>
          </h1>
          <p className="text-primary/40 text-sm font-semibold mt-3">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-primary text-sm font-semibold block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition"
            />
          </div>

          <div>
            <label className="text-primary text-sm font-semibold block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition"
            />
          </div>

          {/* {error && (
            <p className="text-red-500 text-sm">{error.message}</p>
          )} */}

          <button
            type="submit"
            // disabled={isPending}
            className="w-full py-2.5 bg-primary text-secondary text-sm font-semibold rounded-xl transition disabled:opacity-50"
          >
            {"Sign In"}
            {/* {isPending ? "Signing in..." : "Sign In"} */}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;