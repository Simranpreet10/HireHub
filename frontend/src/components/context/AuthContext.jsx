// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/api/profile/me");
        setUser(res.data.user ?? res.data ?? null);
      } catch (err) {
        console.warn("Auth init failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function login(email, password) {
    const res = await api.post("/api/userauth/login", { email, password });
    const token = res.data.token;
    if (token) localStorage.setItem("token", token);
    setUser(res.data.user ?? null);
    return res.data;
  }

  async function signup(payload) {
    const res = await api.post("/api/userauth/signup", payload);
    const token = res.data.token;
    if (token) localStorage.setItem("token", token);
    setUser(res.data.user ?? null);
    return res.data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}



export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}

export default AuthContext;



