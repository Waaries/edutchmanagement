
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserData } from "@/types/user";

interface DeleteUserDialogProps {
  userToDelete: UserData | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteUserDialog = ({ userToDelete, onClose, onSuccess }: DeleteUserDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Function to handle user deletion
  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Check if current user is admin
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin');
      
      if (adminCheckError || !isAdmin) {
        toast({
          title: "Toegang geweigerd",
          description: "Alleen administrators kunnen gebruikers verwijderen.",
          variant: "destructive",
        });
        return;
      }
      
      // Call edge function to delete user (we'll create this)
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: userToDelete.id }
      });
      
      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Fout bij verwijderen gebruiker",
          description: error.message || "Er is een fout opgetreden bij het verwijderen van de gebruiker.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Gebruiker verwijderd",
        description: `Gebruiker ${userToDelete.email} is succesvol verwijderd.`,
      });
      
      // Refresh user list
      onSuccess();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Fout bij verwijderen gebruiker",
        description: error.message || "Er is een fout opgetreden.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gebruiker verwijderen</AlertDialogTitle>
          <AlertDialogDescription>
            Weet je zeker dat je de gebruiker <strong>{userToDelete?.email}</strong> wilt verwijderen? 
            Deze actie kan niet ongedaan worden gemaakt.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuleren</AlertDialogCancel>
          <AlertDialogAction 
            onClick={deleteUser} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Bezig met verwijderen..." : "Verwijderen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
