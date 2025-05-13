import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, User, Users, UserPlus, Trash2, LogOut } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { toast } = useToast();

  // Redirect if not an admin
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users from the auth API
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) throw userError;
        
        // Fetch admin roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('role', 'admin');

        if (rolesError) throw rolesError;

        // Create a set of admin user IDs for quick lookup
        const adminIds = new Set(rolesData.map(role => role.user_id));

        // Combine the data
        const combinedData = userData.users.map((user: any) => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          is_admin: adminIds.has(user.id)
        }));

        setUsers(combinedData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, toast]);

  const makeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: true } : user
      ));

      toast({
        title: "Success",
        description: "User has been granted admin privileges.",
      });
    } catch (error) {
      console.error('Error granting admin role:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin privileges. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: userId, role: 'admin' });

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: false } : user
      ));

      toast({
        title: "Success",
        description: "Admin privileges have been revoked.",
      });
    } catch (error) {
      console.error('Error removing admin role:', error);
      toast({
        title: "Error",
        description: "Failed to revoke admin privileges. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            User Management
          </h2>
          
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableCaption>List of all registered users</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>{new Date(userData.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        userData.is_admin 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {userData.is_admin ? 'Admin' : 'User'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {userData.is_admin ? (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => removeAdmin(userData.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove Admin
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => makeAdmin(userData.id)}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
