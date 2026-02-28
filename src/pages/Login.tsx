import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { GraduationCap, ShieldCheck } from "lucide-react";
import nitLogo from "@/assets/nit-kkr-logo.png";

const Login = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const success = login(rollNumber.trim(), password, role);
    if (success) {
      toast.success("Login successful!");
      navigate(role === "admin" ? "/admin" : "/student");
    } else {
      toast.error("Invalid credentials or role mismatch");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="gradient-header text-primary-foreground py-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={nitLogo} alt="NIT KKR" className="h-16 w-16 rounded-full bg-primary-foreground p-0.5" />
        </div>
        <h1 className="text-2xl font-bold">NIT KKR Mess</h1>
        <p className="text-sm opacity-80">Hostel Mess Management System</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 -mt-8">
        <Card className="w-full max-w-md shadow-card animate-fade-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Select Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(v) => setRole(v as UserRole)}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="student"
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      role === "student" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="student" id="student" />
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="font-medium">Student</span>
                  </Label>
                  <Label
                    htmlFor="admin"
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      role === "admin" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="admin" id="admin" />
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span className="font-medium">Admin</span>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">{role === "admin" ? "Username" : "Roll Number"}</Label>
                <Input
                  id="rollNumber"
                  placeholder={role === "admin" ? "Enter username" : "e.g. 21BCS001"}
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">
                Sign In
              </Button>

              <div className="text-center text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>Student: 21BCS001 / password123</p>
                <p>Admin: admin / admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <footer className="gradient-header text-primary-foreground/70 py-3 text-center text-sm">
        <p>© {new Date().getFullYear()} National Institute of Technology, Kurukshetra</p>
      </footer>
    </div>
  );
};

export default Login;
