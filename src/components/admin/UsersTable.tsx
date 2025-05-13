
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import UsersTableHeader from "./UsersTableHeader";
import UserRow from "./UserRow";
import EmptyUsersList from "./EmptyUsersList";
import UsersTableLoading from "./UsersTableLoading";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type UserData = {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
  last_sign_in_at: string | null;
};

export const UsersTable = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch users data using the secure function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Use the secure get_users function to get user data
      const { data: userData, error: userError } = await supabase
        .rpc('get_users');
      
      if (userError) {
        console.error("Error fetching users:", userError);
        toast({
          title: "Fout bij ophalen gebruikers",
          description: userError.message,
          variant: "destructive",
        });
        return;
      }

      if (!userData || userData.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Then get admin status for each user
      const usersWithRoles = await Promise.all(
        userData.map(async (user) => {
          // Check if user is admin by querying the user_roles table
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", user.id)
            .eq("role", "admin")
            .single();

          return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            is_admin: !!roleData, // Convert to boolean
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error in fetching users:", error);
      toast({
        title: "Fout bij ophalen gebruikers",
        description: "Er is een fout opgetreden bij het ophalen van gebruikers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      
      // Call Supabase function to delete user
      const { error } = await supabase.auth.admin.deleteUser(
        userToDelete.id
      );
      
      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Fout bij verwijderen gebruiker",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Remove user from user_roles table if they are an admin
      if (userToDelete.is_admin) {
        await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userToDelete.id);
      }
      
      toast({
        title: "Gebruiker verwijderd",
        description: `Gebruiker ${userToDelete.email} is succesvol verwijderd.`,
      });
      
      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Fout bij verwijderen gebruiker",
        description: error.message || "Er is een fout opgetreden.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
  };

  if (loading) {
    return <UsersTableLoading />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <UsersTableHeader />
          <TableBody>
            {users.length === 0 ? (
              <EmptyUsersList />
            ) : (
              users.map((user) => (
                <UserRow 
                  key={user.id} 
                  user={user} 
                  onStatusChange={fetchUsers}
                  onDeleteClick={handleDeleteClick}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
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
    </>
  );
};

export default UsersTable;
