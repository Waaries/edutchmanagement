
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/user";

export function useAdminStatus(onStatusChange: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Toggle admin status
  const toggleAdminStatus = async (user: UserData) => {
    try {
      setIsProcessing(true);
      
      // Check if the current user is an admin through RPC
      const { data: isCurrentUserAdmin, error: adminCheckError } = await supabase
        .rpc('is_admin');
        
      if (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        throw new Error("Fout bij controleren admin-status");
      }
      
      // Only allow admin operations if current user is admin
      if (!isCurrentUserAdmin) {
        throw new Error("Alleen administrators kunnen rollen beheren");
      }
      
      console.log("Toggling admin status for:", user.email, "Current status:", user.is_admin);
      
      if (user.is_admin) {
        // Remove admin role
        console.log("Removing admin role from:", user.id);
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", user.id)
          .eq("role", "admin");

        if (error) {
          console.error("Error removing admin role:", error);
          throw error;
        }
        
        toast({
          title: "Adminrechten ingetrokken",
          description: "De gebruiker is geen administrator meer.",
        });
      } else {
        // Add admin role
        console.log("Adding admin role to:", user.id);
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: "admin" });

        if (error) {
          console.error("Error adding admin role:", error);
          throw error;
        }
        
        toast({
          title: "Adminrechten toegekend",
          description: "De gebruiker is nu een administrator.",
        });
      }
      
      // Refresh user list via parent component
      onStatusChange();
    } catch (error: any) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Fout bij wijzigen admin status",
        description: error.message || "Er is een fout opgetreden.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    toggleAdminStatus
  };
}
