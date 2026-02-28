import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Bell } from "lucide-react";
import nitLogo from "@/assets/nit-kkr-logo.png";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="gradient-header text-primary-foreground shadow-lg no-print">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={nitLogo} alt="NIT KKR Logo" className="h-12 w-12 rounded-full bg-primary-foreground p-0.5" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">NIT KKR Mess</h1>
              <p className="text-xs opacity-80">Hostel Mess Management System</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => navigate(user.role === "admin" ? "/admin" : "/student")}
                >
                  Dashboard
                </Button>
              </nav>
              <div className="flex items-center gap-2 pl-4 border-l border-primary-foreground/20">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs opacity-70 capitalize">{user.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="gradient-header text-primary-foreground/70 py-4 text-center text-sm no-print">
        <p>© {new Date().getFullYear()} National Institute of Technology, Kurukshetra. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
