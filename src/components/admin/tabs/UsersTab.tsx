
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UsersTable from "@/components/admin/UsersTable";
import CreateUserDialog from "@/components/admin/CreateUserDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Users, Download, RefreshCw, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UsersTab: React.FC = () => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const { toast } = useToast();

  // Fetch user count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { data, error } = await supabase.rpc('get_users');
        if (error) throw error;
        setUserCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };
    
    if (hasAccess) {
      fetchUserCount();
    }
  }, [hasAccess]);

  const exportUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_users');
      if (error) throw error;

      const csv = [
        ['Email', 'Aangemaakt', 'Laatste Login'].join(','),
        ...data.map((user: any) => [
          user.email,
          new Date(user.created_at).toLocaleDateString('nl-NL'),
          user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('nl-NL') : 'Nooit'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `gebruikers-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Export voltooid",
        description: "Gebruikerslijst is geëxporteerd naar CSV.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export mislukt",
        description: "Er is een fout opgetreden bij het exporteren.",
        variant: "destructive",
      });
    }
  };

  const refreshUsers = () => {
    window.location.reload();
  };

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Use the fixed is_admin function
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error("Error verifying admin access for UsersTab:", error);
          setHasAccess(false);
        } else {
          setHasAccess(data);
        }
      } catch (err) {
        console.error("Exception checking access for UsersTab:", err);
        setHasAccess(false);
      } finally {
        setVerifying(false);
      }
    };
    
    verifyAccess();
  }, [toast]);

  if (verifying) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gebruikersbeheer</CardTitle>
          <CardDescription>Bezig met laden...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (hasAccess === false) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Toegang geweigerd</CardTitle>
          <CardDescription>U heeft geen toegang tot deze functie</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Toegangsfout</AlertTitle>
            <AlertDescription>
              Er is een fout opgetreden bij het verifiëren van uw toegangsrechten.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gebruikersbeheer</CardTitle>
        <CardDescription>Beheer gebruikersaccounts en toegangsrechten</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Belangrijk</AlertTitle>
          <AlertDescription>
            U kunt hier gebruikers beheren, adminrechten toekennen of intrekken. Uw eigen gebruikersaccount 
            is gemarkeerd en kan niet verwijderd worden.
          </AlertDescription>
        </Alert>
        
        {/* User Management Actions */}
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2 flex-1">
            <Button variant="default" size="sm" onClick={() => setCreateUserOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nieuwe Gebruiker
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open('https://supabase.com/dashboard/project/yajulpyjxgwehomkqdqv/auth/users', '_blank')}>
              <Users className="h-4 w-4 mr-2" />
              Supabase Auth Beheer
            </Button>
            <Button variant="outline" size="sm" onClick={exportUsers}>
              <Download className="h-4 w-4 mr-2" />
              Exporteer Gebruikers
            </Button>
            <Button variant="outline" size="sm" onClick={refreshUsers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Ververs Lijst
            </Button>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground px-2 py-1">
              Totaal gebruikers: <strong>{userCount}</strong>
            </span>
          </div>
        </div>
        
        <UsersTable />
        
        <CreateUserDialog 
          open={createUserOpen}
          onOpenChange={setCreateUserOpen}
          onUserCreated={() => {
            refreshUsers();
            // Refresh user count
            const fetchUserCount = async () => {
              try {
                const { data, error } = await supabase.rpc('get_users');
                if (error) throw error;
                setUserCount(data?.length || 0);
              } catch (error) {
                console.error('Error fetching user count:', error);
              }
            };
            fetchUserCount();
          }}
        />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
