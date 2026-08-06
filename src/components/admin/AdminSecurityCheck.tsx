
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { devLog } from "@/lib/logger";

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
  const [verifiedAdmin, setVerifiedAdmin] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!user) {
        setVerifiedAdmin(false);
        setIsVerifying(false);
        return;
      }
      
      try {
        // Log admin access attempt for security monitoring
        
        // Use the fixed is_admin() function via RPC call
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error("Error verifying admin status:", error);
          setVerifiedAdmin(false);
          
          toast({
            title: "Toegangsfout",
            description: "Er is een fout opgetreden bij het verifiëren van uw beheerdersrechten.",
            variant: "destructive",
          });
          
          navigate('/dashboard');
          return;
        }
        
        // data will be true or false from the is_admin function
        devLog("Admin verification result:", data);
        setVerifiedAdmin(data);
        
        // Redirect non-admins with a message
        if (!data) {
          toast({
            title: "Toegang geweigerd",
            description: "U heeft geen toegang tot het admin dashboard.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Exception during admin verification:", err);
        setVerifiedAdmin(false);
        navigate('/dashboard');
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyAdminStatus();
  }, [user, navigate, toast]);

  // Show loading while verifying
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if verified as admin
  return verifiedAdmin ? <>{children}</> : null;
};

export default AdminSecurityCheck;
