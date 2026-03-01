import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User, Users, CalendarDays, CreditCard, FileText, Bell, Plus, Search, Save, Send,
} from "lucide-react";
import {
  generateMockAttendance, calculateBill, MESS_CONFIG, MONTH_NAMES, MOCK_NOTIFICATIONS, MOCK_LEAVES, MONTH_COST_PER_DAY,
} from "@/data/mockData";
import { MOCK_USERS } from "@/data/mockUsers";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Add user form
  const [newUser, setNewUser] = useState({ name: "", rollNumber: "", password: "", phone: "", role: "student", hostelNumber: "", semester: "" });

  // Leave form
  const [leaveForm, setLeaveForm] = useState({ studentSearch: "", studentId: "", fromDate: "", toDate: "" });

  // Notification
  const [notifMessage, setNotifMessage] = useState("");

  // Attendance
  const [attMonth, setAttMonth] = useState(new Date().getMonth() + 1);
  const [attDate, setAttDate] = useState(new Date().getDate());
  const [monthlyCosts, setMonthlyCosts] = useState<Record<number, number>>({ ...MONTH_COST_PER_DAY });
  const year = 2026;

  const students = MOCK_USERS.filter((u) => u.role === "student");

  const filteredUsers = MOCK_USERS.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.rollNumber || !newUser.password) {
      toast.error("Please fill required fields");
      return;
    }
    toast.success(`User ${newUser.name} created successfully!`);
    setNewUser({ name: "", rollNumber: "", password: "", phone: "", role: "student", hostelNumber: "", semester: "" });
  };

  const handleSendNotification = () => {
    if (!notifMessage.trim()) { toast.error("Enter a message"); return; }
    toast.success("Notification sent to all students!");
    setNotifMessage("");
  };

  const handleSaveLeave = () => {
    if (!leaveForm.studentId || !leaveForm.fromDate || !leaveForm.toDate) {
      toast.error("Fill all leave fields");
      return;
    }
    toast.success("Leave saved successfully!");
    setLeaveForm({ studentSearch: "", studentId: "", fromDate: "", toDate: "" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage mess operations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto p-1">
            {[
              { value: "profile", icon: User, label: "Profile" },
              { value: "users", icon: Users, label: "Users" },
              { value: "bills", icon: CreditCard, label: "Bills" },
              { value: "attendance", icon: CalendarDays, label: "Attendance" },
              { value: "leaves", icon: FileText, label: "Leaves" },
              { value: "notifications", icon: Bell, label: "Notifications" },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs sm:text-sm">
                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="animate-fade-in">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Admin Profile</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Name", value: user?.name },
                    { label: "Admin ID", value: user?.rollNumber },
                    { label: "Mobile", value: user?.phone },
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
          </TabsContent>

          {/* Manage Users */}
          <TabsContent value="users" className="animate-fade-in space-y-4">
            {/* Add User */}
            <Card className="shadow-card">
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-success" /> Add User</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Name *</Label>
                    <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Full Name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Roll Number / Username *</Label>
                    <Input value={newUser.rollNumber} onChange={(e) => setNewUser({ ...newUser, rollNumber: e.target.value })} placeholder="e.g. 21BCS003" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Password *</Label>
                    <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mobile</Label>
                    <Input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newUser.role === "student" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Hostel Number</Label>
                        <Input value={newUser.hostelNumber} onChange={(e) => setNewUser({ ...newUser, hostelNumber: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Semester</Label>
                        <Input type="number" value={newUser.semester} onChange={(e) => setNewUser({ ...newUser, semester: e.target.value })} />
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-2">
                    <Button type="submit" className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Create User</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* View Users */}
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> All Users</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Search by name, roll, role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedStudentId(selectedStudentId === u.id ? null : u.id)}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:shadow-card-hover transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.rollNumber}</p>
                        </div>
                      </div>
                      <Badge variant={u.role === "admin" ? "default" : "secondary"} className="capitalize">{u.role}</Badge>
                    </div>
                  ))}
                </div>
                {selectedStudentId && (() => {
                  const s = MOCK_USERS.find((u) => u.id === selectedStudentId);
                  if (!s) return null;
                  return (
                    <div className="mt-4 p-4 border rounded-lg animate-fade-in">
                      <h4 className="font-bold mb-3">User Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                          { label: "Name", value: s.name },
                          { label: "Roll No.", value: s.rollNumber },
                          { label: "Role", value: s.role },
                          { label: "Phone", value: s.phone },
                          { label: "Email", value: s.email },
                          { label: "Hostel", value: s.hostelNumber },
                          { label: "Semester", value: s.semester },
                        ].map((item) => (
                          <div key={item.label}>
                            <span className="text-muted-foreground">{item.label}:</span> <span className="font-medium">{item.value || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bills */}
          <TabsContent value="bills" className="animate-fade-in">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Mess Bill Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Per-month cost editing */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                  {[1, 2, 3, 4, 5, 6].map((m) => (
                    <div key={m} className="space-y-1">
                      <Label className="text-xs">{MONTH_NAMES[m - 1].slice(0, 3)} ₹/day</Label>
                      <Input
                        type="number"
                        className="w-full"
                        value={monthlyCosts[m]}
                        onChange={(e) => setMonthlyCosts({ ...monthlyCosts, [m]: Number(e.target.value) })}
                      />
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted">
                        <th className="text-left px-3 py-2">Student</th>
                        <th className="text-left px-3 py-2">Roll No.</th>
                        {MONTH_NAMES.slice(0, 6).map((m) => (
                          <th key={m} className="text-center px-2 py-2">{m.slice(0, 3)}</th>
                        ))}
                        <th className="text-center px-3 py-2 font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => {
                        let semTotal = 0;
                        return (
                          <tr key={s.id} className="border-b hover:bg-muted/50">
                            <td className="px-3 py-2 font-medium">{s.name}</td>
                            <td className="px-3 py-2 text-muted-foreground">{s.rollNumber}</td>
                            {[1, 2, 3, 4, 5, 6].map((m) => {
                              const att = generateMockAttendance(s.id, m, year);
                              const b = calculateBill(att, monthlyCosts[m] || 120);
                              semTotal += b.totalAmount;
                              return <td key={m} className="text-center px-2 py-2">₹{b.totalAmount}</td>;
                            })}
                            <td className="text-center px-3 py-2 font-bold">₹{semTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance */}
          <TabsContent value="attendance" className="animate-fade-in">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Attendance Management</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={String(attMonth)} onValueChange={(v) => setAttMonth(Number(v))}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTH_NAMES.map((m, i) => (
                        <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button variant="default" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => toast.success("All students marked present")}>
                    Mark All Present
                  </Button>
                  <Button variant="destructive" onClick={() => toast.success("All students marked absent")}>
                    Mark All Absent
                  </Button>
                </div>

                <div className="space-y-2">
                  {students.map((s) => {
                    const att = generateMockAttendance(s.id, attMonth, year);
                    const present = att.records.filter(r => r.status === "present").length;
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm font-semibold">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.rollNumber} · Present: {present} days</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Badge className="bg-success text-success-foreground">P: {present}</Badge>
                          <Badge variant="destructive">A: {att.records.filter(r => r.status === "absent").length}</Badge>
                          <Badge className="bg-leave text-leave-foreground">L: {att.records.filter(r => r.status === "leave").length}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Label>Cost/Day for {MONTH_NAMES[attMonth - 1]}: ₹</Label>
                  <Input type="number" className="w-24" value={monthlyCosts[attMonth] || 120} onChange={(e) => setMonthlyCosts({ ...monthlyCosts, [attMonth]: Number(e.target.value) })} />
                  <Button onClick={() => toast.success(`Monthly bills generated for ${MONTH_NAMES[attMonth - 1]}!`)} className="gradient-primary text-primary-foreground">
                    Generate Monthly Bill
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaves */}
          <TabsContent value="leaves" className="animate-fade-in space-y-4">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Assign Leave</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 relative">
                    <Label>Student (Roll Number)</Label>
                    <Input
                      placeholder="Type roll number..."
                      value={leaveForm.studentSearch}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matched = students.find((s) => s.rollNumber.toLowerCase() === val.toLowerCase());
                        setLeaveForm({ ...leaveForm, studentSearch: val, studentId: matched ? matched.id : "" });
                      }}
                    />
                    {leaveForm.studentSearch && !leaveForm.studentId && (
                      <div className="absolute z-10 top-full left-0 w-full bg-background border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                        {students
                          .filter((s) => s.rollNumber.toLowerCase().includes(leaveForm.studentSearch.toLowerCase()))
                          .map((s) => (
                            <div
                              key={s.id}
                              className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                              onClick={() => setLeaveForm({ ...leaveForm, studentSearch: s.rollNumber, studentId: s.id })}
                            >
                              {s.name} ({s.rollNumber})
                            </div>
                          ))}
                      </div>
                    )}
                    {leaveForm.studentId && (
                      <p className="text-xs text-success">✓ {students.find((s) => s.id === leaveForm.studentId)?.name}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>From Date</Label>
                    <Input type="date" value={leaveForm.fromDate} onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>To Date</Label>
                    <Input type="date" value={leaveForm.toDate} onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })} />
                  </div>
                </div>
                <Button className="mt-4 gradient-primary text-primary-foreground" onClick={handleSaveLeave}>
                  <Save className="h-4 w-4 mr-1" /> Save Leave
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader><CardTitle>Leave Records</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {MOCK_LEAVES.map((l) => (
                    <div key={l.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-semibold">{l.studentName} ({l.rollNumber})</p>
                        <p className="text-xs text-muted-foreground">{l.fromDate} → {l.toDate}</p>
                      </div>
                      <Badge className="bg-leave text-leave-foreground">Leave</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="animate-fade-in space-y-4">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-accent" /> Send Notification</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Write a message to send to all students..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleSendNotification} className="gradient-primary text-primary-foreground">
                  <Send className="h-4 w-4 mr-1" /> Send to All Students
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader><CardTitle>Sent Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="p-3 bg-muted rounded-lg border-l-4 border-accent">
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
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

export default AdminDashboard;
