
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
      
      // First verify the user is an admin using the optimized function
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

      // Instead of querying each user individually, let's get all admin users at once
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (rolesError) {
        console.error("Error fetching admin roles:", rolesError);
        toast({
          title: "Fout bij ophalen rollen",
          description: rolesError.message,
          variant: "destructive",
        });
      }

      // Create a Set of admin user IDs for quick lookup
      const adminUserIds = new Set(adminRoles?.map(role => role.user_id) || []);

      // Map users with their admin status
      const usersWithRoles = userData.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        is_admin: adminUserIds.has(user.id),
        raw_app_meta_data: user.raw_app_meta_data
      }));

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
