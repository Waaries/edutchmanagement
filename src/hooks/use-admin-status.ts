
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/user";

// Define types for our custom RPC functions that aren't in the generated types
type AdminRoleFunctionParams = {
  user_id_param: string;
};

export function useAdminStatus(onStatusChange: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Toggle admin status using stored procedures instead of direct RLS-affected operations
  const toggleAdminStatus = async (user: UserData) => {
    try {
      setIsProcessing(true);
      
      
      if (user.is_admin) {
        // Remove admin role using RPC function to avoid RLS recursion
        const { error } = await supabase
          .rpc('remove_admin_role', { user_id_param: user.id });

        if (error) {
          console.error("Error removing admin role:", error);
          throw error;
        }
        
        toast({
          title: "Adminrechten ingetrokken",
          description: "De gebruiker is geen administrator meer.",
        });
      } else {
        // Add admin role using RPC function to avoid RLS recursion
        const { error } = await supabase
          .rpc('add_admin_role', { user_id_param: user.id });

        if (error) {
          console.error("Error adding admin role:", error);
          throw error;
        }
        
        toast({
          title: "Adminrechten toegekend",
          description: "De gebruiker is nu een administrator.",
        });
      }
      
      // Force a slight delay before refreshing to ensure the database has updated
      setTimeout(() => {
        // Refresh user list via parent component
        onStatusChange();
        setIsProcessing(false);
      }, 500);
    } catch (error: any) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Fout bij wijzigen admin status",
        description: error.message || "Er is een fout opgetreden.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    toggleAdminStatus
  };
}
