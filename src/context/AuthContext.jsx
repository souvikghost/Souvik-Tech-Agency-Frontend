import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On every refresh — check if cookie is still valid
  useEffect(() => {
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login  = (userData) => setUser(userData);
  const logout = () => setUser(null);

  if (loading) return (
  <div className="min-h-screen bg-secondary flex flex-col items-center justify-center gap-4">
    <div className="loader"></div>
    <p className="text-primary/30 font-semibold text-base">Authenticating your session . . .</p>
  </div>
);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);