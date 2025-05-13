
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "@/components/admin/UsersTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UsersTab: React.FC = () => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Get current user ID first
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setHasAccess(false);
          setVerifying(false);
          return;
        }
        
        // Check admin status directly
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'admin');
        
        if (error) {
          console.error("Error verifying admin access for UsersTab:", error);
          setHasAccess(false);
        } else {
          const isAdmin = Array.isArray(data) && data.length > 0;
          setHasAccess(isAdmin);
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
        <UsersTable />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
