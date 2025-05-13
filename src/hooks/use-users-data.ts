
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/types/user";

export function useUsersData() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, fetchUsers };
}
