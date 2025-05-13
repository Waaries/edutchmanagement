import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, UserX, UserMinus, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserData } from "@/types/user";

type UserRowProps = {
  user: UserData;
  onStatusChange: () => void;
  onDeleteClick: (user: UserData) => void;
};

export const UserRow = ({ user, onStatusChange, onDeleteClick }: UserRowProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  // Don't show admin toggle for the current user
  const isCurrentUser = currentUser && currentUser.id === user.id;

  // Toggle admin status
  const toggleAdminStatus = async () => {
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

  const handleDeleteClick = () => {
    onDeleteClick(user);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell>{new Date(user.created_at).toLocaleDateString('nl-NL')}</TableCell>
      <TableCell>
        {user.last_sign_in_at 
          ? new Date(user.last_sign_in_at).toLocaleDateString('nl-NL') 
          : 'Nooit'}
      </TableCell>
      <TableCell>
        {user.is_admin ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-300" />
        )}
      </TableCell>
      <TableCell className="text-right space-x-2">
        {!isCurrentUser && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleAdminStatus}
            disabled={isProcessing}
            className={user.is_admin ? "text-red-500" : "text-green-500"}
          >
            {user.is_admin ? (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Verwijder admin
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Maak admin
              </>
            )}
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          className="text-red-500 ml-2"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Verwijder
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
