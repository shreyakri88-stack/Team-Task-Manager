import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("ttmp_user");
    const storedToken = localStorage.getItem("ttmp_token");
    if (storedUser && storedToken) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (payload) => {
    const { data } = await axiosClient.post("/auth/login", payload);
    localStorage.setItem("ttmp_token", data.token);
    localStorage.setItem("ttmp_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (payload) => {
    const { data } = await axiosClient.post("/auth/signup", payload);
    localStorage.setItem("ttmp_token", data.token);
    localStorage.setItem("ttmp_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("ttmp_token");
    localStorage.removeItem("ttmp_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, isAuthenticated: Boolean(user) }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
