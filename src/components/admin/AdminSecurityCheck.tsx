
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { convertToUserData } from "@/types/user";

interface AdminSecurityCheckProps {
  user: User;
  isAdmin: boolean;
  children: React.ReactNode;
}

const AdminSecurityCheck: React.FC<AdminSecurityCheckProps> = ({ 
  user, 
  isAdmin, 
  children 
}) => {
  const [localAdminCheck, setLocalAdminCheck] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Log admin access for security monitoring
    if (user && isAdmin) {
      console.log("Admin dashboard accessed by:", user.email);
      // Double check admin status directly with Supabase
      checkAdminStatusDirectly();
    }
  }, [isAdmin, user]);

  // Function to check admin status directly with Supabase
  const checkAdminStatusDirectly = async () => {
    if (!user) return;
    
    try {
      // Direct query to user_roles table instead of using RPC function
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        setLocalAdminCheck(false);
        return;
      }
      
      setLocalAdminCheck(!!data);
    } catch (err) {
      console.error("Exception during admin check:", err);
      setLocalAdminCheck(false);
    }
  };

  if (localAdminCheck === false) {
    return null;
  }

  return <>{children}</>;
};

export default AdminSecurityCheck;
