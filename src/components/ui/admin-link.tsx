
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export function AdminLink() {
  const { user } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setShowAdmin(false);
        setChecking(false);
        return;
      }
      
      try {
        // Use the fixed is_admin function 
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error || !data) {
          console.error("Error checking admin status:", error);
          setShowAdmin(false);
        } else {
          setShowAdmin(data);
        }
      } catch (err) {
        console.error("Exception checking admin status:", err);
        setShowAdmin(false);
      } finally {
        setChecking(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
  if (checking || !showAdmin) return null;
  
  return (
    <Button variant="ghost" asChild className={cn("flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border border-amber-300")}>
      <Link to="/admin">
        <Shield className="h-4 w-4 text-amber-600" />
        <span>Admin Dashboard</span>
      </Link>
    </Button>
  );
}
