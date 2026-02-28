export interface AttendanceRecord {
  date: number;
  status: "present" | "absent" | "leave";
}

export interface MonthlyAttendance {
  studentId: string;
  month: number;
  year: number;
  records: AttendanceRecord[];
}

export interface MessBill {
  studentId: string;
  month: number;
  year: number;
  totalDaysPresent: number;
  costPerDay: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
}

export interface LeaveRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  fromDate: string;
  toDate: string;
  approvedBy: string;
}

export interface Notification {
  id: string;
  message: string;
  sentBy: string;
  createdAt: string;
}

export const MESS_CONFIG = {
  costPerDay: 120,
};

// Per-month cost per day (can be different for each month)
export const MONTH_COST_PER_DAY: Record<number, number> = {
  1: 120,
  2: 120,
  3: 125,
  4: 125,
  5: 130,
  6: 130,
  7: 120,
  8: 120,
  9: 125,
  10: 125,
  11: 130,
  12: 130,
};

// Generate attendance for a student in a month
export function generateMockAttendance(studentId: string, month: number, year: number): MonthlyAttendance {
  const daysInMonth = new Date(year, month, 0).getDate();
  const records: AttendanceRecord[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const rand = Math.random();
    records.push({
      date: d,
      status: rand > 0.85 ? "absent" : rand > 0.75 ? "leave" : "present",
    });
  }
  return { studentId, month, year, records };
}

export function calculateBill(attendance: MonthlyAttendance, costPerDay: number): MessBill {
  const totalDaysPresent = attendance.records.filter((r) => r.status === "present").length;
  const totalAmount = totalDaysPresent * costPerDay;
  const paidAmount = 0;
  return {
    studentId: attendance.studentId,
    month: attendance.month,
    year: attendance.year,
    totalDaysPresent,
    costPerDay,
    totalAmount,
    paidAmount,
    balance: totalAmount - paidAmount,
  };
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    message: "Mess timings have been updated. Breakfast: 7:30-9:00 AM, Lunch: 12:30-2:00 PM, Dinner: 7:30-9:00 PM.",
    sentBy: "Admin",
    createdAt: "2026-02-25T10:00:00Z",
  },
  {
    id: "2",
    message: "Mess fee for February has been updated. Please check your bill section.",
    sentBy: "Admin",
    createdAt: "2026-02-20T14:00:00Z",
  },
];

export const MOCK_LEAVES: LeaveRecord[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Rahul Sharma",
    rollNumber: "21BCS001",
    fromDate: "2026-02-10",
    toDate: "2026-02-12",
    approvedBy: "Admin",
  },
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
