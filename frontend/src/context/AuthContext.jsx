import { createContext, useContext, useState, useEffect } from "react";
import { getMe, login as apiLogin } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const demoUser = localStorage.getItem("demo-user");
  
    if (token && demoUser) {
      setUser(JSON.parse(demoUser));
    }
  
    setLoading(false);
  }, []);

  async function login(username, password) {
    if (username === "admin" && password === "admin123") {
      const demoUser = {
        id: 1,
        username: "admin",
        name: "Administrator",
        role: "Admin",
      };
  
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("demo-user", JSON.stringify(demoUser));
      setUser(demoUser);
  
      return {
        token: "demo-token",
        user: demoUser,
      };
    }
  
    throw new Error("Username atau password salah");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("demo-user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
