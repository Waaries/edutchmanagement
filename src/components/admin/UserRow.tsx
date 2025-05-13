
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, UserX, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UserRowProps = {
  user: {
    id: string;
    email: string;
    created_at: string;
    is_admin: boolean;
    last_sign_in_at: string | null;
  };
  onStatusChange: () => void;
};

export const UserRow = ({ user, onStatusChange }: UserRowProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Toggle admin status
  const toggleAdminStatus = async () => {
    try {
      setIsProcessing(true);
      
      if (user.is_admin) {
        // Remove admin role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", user.id)
          .eq("role", "admin");

        if (error) throw error;
        
        toast({
          title: "Adminrechten ingetrokken",
          description: "De gebruiker is geen administrator meer.",
        });
      } else {
        // Add admin role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: "admin" });

        if (error) throw error;
        
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
      <TableCell className="text-right">
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
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
