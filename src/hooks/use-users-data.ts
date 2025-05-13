
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/types/user";

export function useUsersData() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users data using direct queries to avoid recursion issues
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get current user ID first
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;
      
      if (!currentUserId) {
        console.error("No authenticated user found");
        toast({
          title: "Toegang geweigerd",
          description: "U bent niet ingelogd.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Direct database query instead of using is_admin function
      const { data: isAdminData, error: isAdminError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('role', 'admin');
      
      if (isAdminError || !isAdminData || isAdminData.length === 0) {
        console.error("Error checking admin permissions:", isAdminError);
        toast({
          title: "Toegang geweigerd",
          description: "U heeft geen admin rechten om gebruikersgegevens te bekijken.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Get all users from auth.users via secure function
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

      // Get all admin roles directly
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
      console.log("Admin user IDs:", Array.from(adminUserIds));

      // Map users with their admin status
      const usersWithRoles = userData.map(user => {
        const isAdmin = adminUserIds.has(user.id);
        console.log(`User ${user.email} (${user.id}) is admin: ${isAdmin}`);
        
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          is_admin: isAdmin,
          raw_app_meta_data: user.raw_app_meta_data
        };
      });

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
