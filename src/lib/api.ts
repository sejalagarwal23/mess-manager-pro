/**
 * ==========================================================
 * FRONTEND API HELPER — connects React to Express backend
 * ==========================================================
 *
 * USAGE:
 *   import { api, getToken, setToken } from "@/lib/api";
 *
 * LOCAL DEV:  Backend at http://localhost:5000
 * PRODUCTION: Set VITE_API_BASE_URL env var in Vercel to your deployed backend URL
 *
 * This file REPLACES the Supabase client (src/integrations/supabase/client.ts)
 * for all data operations.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ---- Token Management (JWT stored in localStorage) ----
export const getToken = (): string | null => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

// ---- Base fetch wrapper with auth header ----
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

// ---- AUTH ----
// Replaces: supabase.auth.signInWithPassword()
export const authApi = {
  login: (rollNumber: string, password: string, role: string) =>
    request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ rollNumber, password, role }),
    }),

  // Replaces: supabase.auth.signUp()
  register: (data: any) =>
    request<{ message: string; userId: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Replaces: supabase.auth.getUser()
  getMe: () => request<any>("/auth/me"),
};

// ---- USERS ----
// Replaces: supabase.from('users').select()
export const usersApi = {
  getAll: (search?: string) =>
    request<any[]>(`/users${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  getStudents: () => request<any[]>("/users/students"),

  getById: (id: string) => request<any>(`/users/${id}`),

  // Replaces: supabase.from('users').insert()
  create: (data: any) =>
    request<any>("/users", { method: "POST", body: JSON.stringify(data) }),

  // Replaces: supabase.from('users').delete()
  delete: (id: string) =>
    request<any>(`/users/${id}`, { method: "DELETE" }),
};

// ---- ATTENDANCE ----
// Replaces: supabase.from('attendance').select()
export const attendanceApi = {
  get: (studentId: string, month: number, year: number) =>
    request<any[]>(`/attendance?studentId=${studentId}&month=${month}&year=${year}`),

  getSummary: (month: number, year: number) =>
    request<any[]>(`/attendance/summary?month=${month}&year=${year}`),

  // Replaces: supabase.from('attendance').upsert()
  mark: (date: string, records: { studentId: string; status: string }[]) =>
    request<any>("/attendance/mark", {
      method: "POST",
      body: JSON.stringify({ date, records }),
    }),

  markAll: (date: string, status: "present" | "absent") =>
    request<any>("/attendance/mark-all", {
      method: "POST",
      body: JSON.stringify({ date, status }),
    }),
};

// ---- LEAVES ----
// Replaces: supabase.from('leaves').select()
export const leavesApi = {
  getAll: (studentId?: string) =>
    request<any[]>(`/leaves${studentId ? `?studentId=${studentId}` : ""}`),

  // Replaces: supabase.from('leaves').insert()
  create: (data: { studentId: string; fromDate: string; toDate: string }) =>
    request<any>("/leaves", { method: "POST", body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<any>(`/leaves/${id}`, { method: "DELETE" }),
};

// ---- BILLS ----
// Replaces: supabase.rpc('calculate_bill')
export const billsApi = {
  getStudentBill: (studentId: string, month: number, year: number) =>
    request<any>(`/bills?studentId=${studentId}&month=${month}&year=${year}`),

  getAllBills: (year: number) =>
    request<any[]>(`/bills/all?year=${year}`),
};

// ---- NOTIFICATIONS ----
// Replaces: supabase.from('notifications').select()
export const notificationsApi = {
  getAll: () => request<any[]>("/notifications"),

  // Replaces: supabase.from('notifications').insert()
  send: (message: string) =>
    request<any>("/notifications", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  markAsRead: (id: string) =>
    request<any>(`/notifications/${id}/read`, { method: "PATCH" }),
};

// ---- MESS CONFIG ----
// Replaces: supabase.from('mess_config').select()
export const messConfigApi = {
  get: (year: number) =>
    request<any[]>(`/mess-config?year=${year}`),

  // Replaces: supabase.from('mess_config').upsert()
  update: (month: number, year: number, costPerDay: number) =>
    request<any>("/mess-config", {
      method: "PUT",
      body: JSON.stringify({ month, year, costPerDay }),
    }),
};
