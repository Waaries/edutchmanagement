
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, User, UserX, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First get users from auth schema (only accessible through admin api)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching users:", authError);
        toast({
          title: "Fout bij ophalen gebruikers",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // Then get admin status for each user
      const usersWithRoles = await Promise.all(
        authUsers.users.map(async (user) => {
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

  // Toggle admin status
  const toggleAdminStatus = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
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
          .insert({ user_id: userId, role: "admin" });

        if (error) throw error;
        
        toast({
          title: "Adminrechten toegekend",
          description: "De gebruiker is nu een administrator.",
        });
      }
      
      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Fout bij wijzigen admin status",
        description: error.message || "Er is een fout opgetreden.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Aangemaakt op</TableHead>
            <TableHead>Laatste inlog</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                Geen gebruikers gevonden
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
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
                    onClick={() => toggleAdminStatus(user.id, user.is_admin)}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
