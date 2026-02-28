import React, { createContext, useContext, useState, ReactNode } from "react";

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
  login: (rollNumber: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    rollNumber: "21BCS001",
    password: "password123",
    role: "student",
    phone: "9876543210",
    email: "rahul@nitkkr.ac.in",
    hostelNumber: "H-7",
    semester: 6,
  },
  {
    id: "2",
    name: "Priya Singh",
    rollNumber: "21BCS002",
    password: "password123",
    role: "student",
    phone: "9876543211",
    email: "priya@nitkkr.ac.in",
    hostelNumber: "GH-1",
    semester: 6,
  },
  {
    id: "3",
    name: "Admin User",
    rollNumber: "admin",
    password: "admin123",
    role: "admin",
    phone: "9876500000",
    email: "admin@nitkkr.ac.in",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (rollNumber: string, password: string, role: UserRole): boolean => {
    const found = MOCK_USERS.find(
      (u) => u.rollNumber === rollNumber && u.password === password && u.role === role
    );
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export { MOCK_USERS };
