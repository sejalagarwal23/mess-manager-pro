// TODO [MERN INTEGRATION]: Replace mock data with API calls:
// import { attendanceApi, billsApi, notificationsApi, messConfigApi } from "@/lib/api";
//
// Example:
//   const [attendance, setAttendance] = useState(null);
//   const [bill, setBill] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//
//   useEffect(() => {
//     attendanceApi.get(user.id, selectedMonth, year).then(setAttendance);
//   }, [selectedMonth]);
//
//   useEffect(() => {
//     billsApi.getStudentBill(user.id, billMonth, year).then(setBill);
//   }, [billMonth]);
//
//   useEffect(() => {
//     notificationsApi.getAll().then(setNotifications);
//   }, []);

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, CalendarDays, BookOpen, Bell, Printer } from "lucide-react";
import { generateMockAttendance, calculateBill, MESS_CONFIG, MONTH_NAMES, MOCK_NOTIFICATIONS } from "@/data/mockData";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [billMonth, setBillMonth] = useState(new Date().getMonth() + 1);
  const year = 2026;

  const attendance = useMemo(() => generateMockAttendance(user!.id, selectedMonth, year), [user, selectedMonth]);
  const bill = useMemo(() => calculateBill(
    generateMockAttendance(user!.id, billMonth, year),
    MESS_CONFIG.costPerDay
  ), [user, billMonth]);

  const daysInMonth = new Date(year, selectedMonth, 0).getDate();
  const firstDay = new Date(year, selectedMonth - 1, 1).getDay();

  const presentCount = attendance.records.filter(r => r.status === "present").length;
  const absentCount = attendance.records.filter(r => r.status === "absent").length;
  const leaveCount = attendance.records.filter(r => r.status === "leave").length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Student Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          {MOCK_NOTIFICATIONS.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Bell className="h-3 w-3" /> {MOCK_NOTIFICATIONS.length} Notifications
            </Badge>
          )}
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="details" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <User className="h-3.5 w-3.5" /> Details
            </TabsTrigger>
            <TabsTrigger value="bill" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <CreditCard className="h-3.5 w-3.5" /> Bill
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <CalendarDays className="h-3.5 w-3.5" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <BookOpen className="h-3.5 w-3.5" /> Rules
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="animate-fade-in">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Student Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Name", value: user?.name },
                    { label: "Roll Number", value: user?.rollNumber },
                    { label: "Mobile", value: user?.phone },
                    { label: "Hostel", value: user?.hostelNumber },
                    { label: "Semester", value: user?.semester },
                    { label: "Email", value: user?.email },
                  ].map((item) => (
                    <div key={item.label} className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{item.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-card mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-accent" /> Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="p-3 bg-muted rounded-lg border-l-4 border-accent">
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bill Tab */}
          <TabsContent value="bill" className="animate-fade-in">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Mess Bill</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={String(billMonth)} onValueChange={(v) => setBillMonth(Number(v))}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_NAMES.map((m, i) => (
                        <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => window.print()} className="flex items-center gap-1">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: "Month", value: `${MONTH_NAMES[billMonth - 1]} ${year}` },
                        { label: "Total Present Days", value: bill.totalDaysPresent },
                        { label: "Cost Per Day", value: `₹${bill.costPerDay}` },
                        { label: "Total Amount", value: `₹${bill.totalAmount}`, bold: true },
                        { label: "Paid Amount", value: `₹${bill.paidAmount}` },
                        { label: "Balance Due", value: `₹${bill.balance}`, accent: true },
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                          <td className="px-4 py-3 font-medium text-muted-foreground">{row.label}</td>
                          <td className={`px-4 py-3 text-right ${row.bold ? "font-bold text-foreground" : ""} ${row.accent ? "font-bold text-destructive" : ""}`}>
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="animate-fade-in">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Attendance</CardTitle>
                <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_NAMES.map((m, i) => (
                      <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="flex gap-4 mb-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-success" /> Present ({presentCount})</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-destructive" /> Absent ({absentCount})</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-leave" /> Leave ({leaveCount})</span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-2 font-semibold text-muted-foreground">{d}</div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {attendance.records.map((rec) => {
                    const colorClass = rec.status === "present"
                      ? "bg-success text-success-foreground"
                      : rec.status === "absent"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-leave text-leave-foreground";
                    return (
                      <div key={rec.date} className={`py-2 rounded-md font-medium ${colorClass}`}>
                        {rec.date}
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="mt-4 p-3 bg-muted rounded-lg flex justify-between text-sm">
                  <span>Cost per day: <strong>₹{MESS_CONFIG.costPerDay}</strong></span>
                  <span>Monthly bill: <strong>₹{presentCount * MESS_CONFIG.costPerDay}</strong></span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="animate-fade-in">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Rules & Regulations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Mess timings must be strictly followed. Breakfast: 7:30–9:00 AM, Lunch: 12:30–2:00 PM, Dinner: 7:30–9:00 PM.",
                  "Students must carry their ID cards while entering the mess.",
                  "Wasting food is strictly prohibited. Disciplinary action will be taken against offenders.",
                  "Leave applications must be submitted at least 1 day in advance to the mess admin.",
                  "Mess fee must be paid before the 10th of every month.",
                  "Outside food is not allowed inside the mess hall.",
                  "Students must maintain cleanliness and discipline in the mess.",
                  "Any complaints regarding food quality should be reported to the mess committee.",
                ].map((rule, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-muted rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground">{rule}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
