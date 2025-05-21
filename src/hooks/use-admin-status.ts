
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/user";

export function useAdminStatus(onStatusChange: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Toggle admin status using stored procedures instead of direct RLS-affected operations
  const toggleAdminStatus = async (user: UserData) => {
    try {
      setIsProcessing(true);
      
      console.log("Toggling admin status for:", user.email, "Current status:", user.is_admin);
      
      if (user.is_admin) {
        // Remove admin role using RPC function to avoid RLS recursion
        console.log("Removing admin role from:", user.id);
        const { error } = await supabase
          .rpc('remove_admin_role', { user_id_param: user.id } as any);

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
        console.log("Adding admin role to:", user.id);
        const { error } = await supabase
          .rpc('add_admin_role', { user_id_param: user.id } as any);

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
