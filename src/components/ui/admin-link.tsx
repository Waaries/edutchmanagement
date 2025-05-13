
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export function AdminLink() {
  const { isAdmin, user } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [directAdminCheck, setDirectAdminCheck] = useState<boolean | null>(null);
  
  // Function to directly check admin status through RPC
  const checkAdminStatusDirectly = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error("Admin link - Error checking admin status:", error);
        return false;
      }
      
      return !!data;
    } catch (err) {
      console.error("Admin link - Exception during admin check:", err);
      return false;
    }
  };
  
  useEffect(() => {
    // Only check when user is logged in
    if (user) {
      const checkStatus = async () => {
        // Check directly with RPC function
        const isAdminUser = await checkAdminStatusDirectly();
        setDirectAdminCheck(isAdminUser);
        
        // Show admin link if either check passes
        const shouldShowAdmin = isAdmin || isAdminUser;
        setShowAdmin(shouldShowAdmin);
        console.log("Admin link visibility check:", { 
          isAdmin, 
          directCheck: isAdminUser, 
          shouldShow: shouldShowAdmin,
          userId: user.id 
        });
      };
      
      checkStatus();
    } else {
      setShowAdmin(false);
      setDirectAdminCheck(false);
    }
  }, [isAdmin, user]);
  
  if (!showAdmin) return null;
  
  return (
    <Button variant="ghost" asChild className={cn("flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border border-amber-300")}>
      <Link to="/admin">
        <Shield className="h-4 w-4 text-amber-600" />
        <span>Admin Dashboard</span>
      </Link>
    </Button>
  );
}
