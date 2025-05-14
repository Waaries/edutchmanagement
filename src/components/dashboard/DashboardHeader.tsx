
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  isAdmin: boolean;
}

const DashboardHeader = ({ isAdmin }: DashboardHeaderProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [hasAdminRole, setHasAdminRole] = useState(false);
  
  useEffect(() => {
    const verifyAdminRole = async () => {
      if (!user) return;
      
      try {
        // Use the fixed is_admin function
        const { data, error } = await supabase.rpc('is_admin');
        
        if (!error) {
          setHasAdminRole(!!data);
        }
      } catch (err) {
        console.error("Error verifying admin role:", err);
      }
    };
    
    verifyAdminRole();
  }, [user]);

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
        {(isAdmin || hasAdminRole) && (
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
