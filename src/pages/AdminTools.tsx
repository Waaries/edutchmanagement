import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

const AdminTools = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const makeUserAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      // Check if the user exists using the auth API
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

      if (userError || !userData.user) {
        toast({
          title: "User Not Found",
          description: "Please check the user ID and try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Then add admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been granted admin privileges.",
      });
      setUserId('');
    } catch (error) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin privileges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAdmin>
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center mb-6">
          <ShieldAlert className="h-8 w-8 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold">Admin Tools</h1>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <p className="text-amber-800 text-sm">
            This page is for setting up your first admin user. After registering 
            a new user through the normal registration process, enter their User ID 
            here to grant admin privileges.
          </p>
        </div>

        <form onSubmit={makeUserAdmin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input 
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter the User ID to make admin"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Make Admin"}
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
};

export default AdminTools;
