import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { devLog } from "@/lib/logger";

interface DashboardHeaderProps {
  isAdmin: boolean;
}

const DashboardHeader = ({ isAdmin }: DashboardHeaderProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const verifyAdminRole = async () => {
      if (!user) return;
      
      try {
        // Gebruik de fixed is_admin function
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error("Error verifying admin role:", error);
          toast({
            title: "Verificatie fout",
            description: "Er was een probleem bij het controleren van uw beheerdersrechten.",
            variant: "destructive",
          });
        } else {
          setHasAdminRole(!!data);
          devLog("Admin check result:", data);
        }
      } catch (err) {
        console.error("Error verifying admin role:", err);
      }
    };
    
    verifyAdminRole();
  }, [user, toast]);

  const goToAdmin = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // No need for additional logic here since signOut handles the redirect
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Uitloggen mislukt",
        description: "Er was een probleem bij het uitloggen.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6 justify-between flex-wrap">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/20">
          <LayoutDashboard className="h-7 w-7 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {(isAdmin || hasAdminRole) && (
          <Button
            onClick={goToAdmin}
            variant="outline"
            className="flex items-center gap-2 border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
          >
            <Shield className="h-4 w-4" />
            <span>Ga naar Admin Dashboard</span>
          </Button>
        )}
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/90 hover:bg-red-500 text-white border-0"
        >
          <LogOut className="h-4 w-4" />
          <span>Uitloggen</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
