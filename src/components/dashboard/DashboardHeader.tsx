import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
          console.log("Admin check result:", data);
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
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
          >
            <Shield className="h-4 w-4 text-primary" />
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
