import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MOCK_USERS } from "../data/mockUsers";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  rollNumber: string;
  role: UserRole;
  phone: string;
  email?: string;
  hostelNumber?: string;
  semester?: number;
}

interface AuthContextType {
  user: User | null;
  login: (
    rollNumber: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔥 Toggle this when backend is ready
const USE_MOCK = true;

const API_BASE = "http://localhost:5000/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Persist login on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && USE_MOCK) {
      const storedUser = localStorage.getItem("mockUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    // Later when backend exists:
    // if (token && !USE_MOCK) {
    //   fetch profile using token
    // }
  }, []);

  const login = async (
    rollNumber: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    // =========================
    // 🔹 MOCK MODE
    // =========================
    if (USE_MOCK) {
      const found = MOCK_USERS.find(
        (u) =>
          u.rollNumber === rollNumber &&
          u.password === password &&
          u.role === role
      );

      if (!found) return false;

      const { password: _, ...userData } = found;

      localStorage.setItem("token", "mock-token");
      localStorage.setItem("mockUser", JSON.stringify(userData));
      setUser(userData);

      return true;
    }

    // =========================
    // 🔹 BACKEND MODE
    // =========================
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rollNumber, password, role }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mockUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
};