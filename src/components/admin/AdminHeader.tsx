import React from "react";
import { Shield, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminHeaderProps {
  userEmail?: string | null;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    // signOut handles the redirect automatically
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={goToDashboard}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Naar Gebruikersdashboard</span>
        </Button>
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

export default AdminHeader;
