
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  isAdmin: boolean;
}

const DashboardHeader = ({ isAdmin }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const goToAdmin = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center gap-4 mb-6 justify-between">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Button 
            onClick={goToAdmin}
            variant="outline" 
            className="bg-amber-100 hover:bg-amber-200 flex items-center gap-2"
          >
            <Shield className="h-4 w-4 text-amber-600" />
            <span>Ga naar Admin Dashboard</span>
          </Button>
        )}
        <Button 
          onClick={handleLogout}
          variant="destructive" 
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Uitloggen</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
