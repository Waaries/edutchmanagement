
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/types/user";

export function useUsersData() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users data using the fixed is_admin function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Check admin status first using the fixed is_admin function
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
      
      if (adminError || !isAdmin) {
        console.error("Error checking admin permissions:", adminError);
        toast({
          title: "Toegang geweigerd",
          description: "U heeft geen admin rechten om gebruikersgegevens te bekijken.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Get all users from auth.users via secure function
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_users');
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
        toast({
          title: "Fout bij ophalen gebruikers",
          description: usersError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!usersData || usersData.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Get admin status directly from the is_admin_user function for each user
      const usersWithRoles = await Promise.all(usersData.map(async user => {
        try {
          // Call individual is_admin check for each user
          const { data: isUserAdmin, error: userAdminError } = await supabase
            .rpc('is_admin_user', { user_id_param: user.id });
            
          if (userAdminError) {
            console.error(`Error checking admin status for user ${user.email}:`, userAdminError);
          }
          
          return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            is_admin: !!isUserAdmin, // Convert to boolean
            raw_app_meta_data: user.raw_app_meta_data
          };
        } catch (err) {
          console.error(`Error processing admin status for user ${user.email}:`, err);
          return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            is_admin: false, // Default to false on error
            raw_app_meta_data: user.raw_app_meta_data
          };
        }
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
