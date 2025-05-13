
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
      
      // First verify the user is an admin
      const { data: isAdminData, error: isAdminError } = await supabase.rpc('is_admin');
      
      if (isAdminError || !isAdminData) {
        console.error("Error checking admin permissions:", isAdminError);
        toast({
          title: "Toegang geweigerd",
          description: "U heeft geen admin rechten om gebruikersgegevens te bekijken.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
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
        setLoading(false);
        return;
      }

      if (!userData || userData.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Fetch admin status for each user directly
      const usersWithRoles = await Promise.all(
        userData.map(async (user) => {
          // Direct query to user_roles table - avoiding the problematic function
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('*')  // Select all columns to avoid potential ambiguity
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle();
            
          if (roleError) {
            console.error(`Error checking admin status for user ${user.id}:`, roleError);
          }

          return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            is_admin: !!roleData, // User is admin if we found an admin role record
            raw_app_meta_data: user.raw_app_meta_data
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
