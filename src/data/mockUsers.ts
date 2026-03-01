import { User } from "../contexts/AuthContext";

export const MOCK_USERS: (User & { password: string })[] = [
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