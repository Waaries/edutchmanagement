
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, LayoutDashboard, Settings, Calendar, Shield, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [directAdminCheck, setDirectAdminCheck] = useState<boolean | null>(null);

  useEffect(() => {
    // Update the document title
    document.title = "Dashboard | eDutch Management";
    
    console.log('Dashboard page - Auth state:', { user: !!user, loading, isAdmin });
    
    // Do direct admin check when user is loaded
    if (user && !loading) {
      checkAdminStatus();
    }
  }, [user, loading, isAdmin]);

  // Direct check against the user_roles table
  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        setDirectAdminCheck(false);
        return;
      }
      
      const isAdminUser = !!data;
      console.log("Direct admin check result:", isAdminUser);
      setDirectAdminCheck(isAdminUser);
    } catch (err) {
      console.error("Error in admin check:", err);
      setDirectAdminCheck(false);
    }
  };

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" />;
  }

  const goToAdmin = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    await signOut();
    // No need to navigate here, the signOut method will handle the redirection
  };

  // Use either the context isAdmin or directly checked admin status
  const userIsAdmin = isAdmin || directAdminCheck;

  return (
    <div className="container mx-auto py-8 px-4 pt-32">
      <div className="flex items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          {userIsAdmin && (
            <Button 
              onClick={goToAdmin}
              variant="outline" 
              className="bg-amber-100 hover:bg-amber-200 flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-amber-600" />
              <span>Ga naar Admin Dashboard</span>
            </Button>
          )}
          <Button 
            onClick={handleLogout}
            variant="destructive" 
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Uitloggen</span>
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welkom, {user.email}</CardTitle>
          <CardDescription>
            Bekijk uw persoonlijke dashboard bij eDutch Management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Vanuit dit dashboard kunt u al uw gegevens en activiteiten beheren.</p>
          <div className="mt-4 p-3 border rounded bg-slate-50">
            <p><strong>Account Type:</strong> {userIsAdmin ? 'Administrator' : 'Standaard Gebruiker'}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overzicht</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profiel</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Afspraken</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profiel</CardTitle>
                <CardDescription>Bekijk en bewerk uw profiel</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Bekijk en bewerk uw persoonlijke gegevens.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("profile")}>Naar profiel</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Afspraken</CardTitle>
                <CardDescription>Beheer uw afspraken</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Bekijk en beheer uw geplande afspraken.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("appointments")}>Bekijk afspraken</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Instellingen</CardTitle>
                <CardDescription>Pas uw voorkeuren aan</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Pas uw account- en notificatie-instellingen aan.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Instellingen bekijken</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profielgegevens</CardTitle>
              <CardDescription>Bekijk en bewerk uw profiel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-muted-foreground">E-mail</span>
                  <span>{user.email}</span>
                </div>
                <div>
                  <p className="text-muted-foreground mb-4">
                    Profielbewerking wordt momenteel ontwikkeld. Binnenkort kunt u hier uw gegevens bijwerken.
                  </p>
                  <Button variant="outline" disabled>Profiel bewerken</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Afsprakenbeheer</CardTitle>
              <CardDescription>Bekijk en beheer uw afspraken</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Afsprakenbeheer wordt momenteel ontwikkeld. Binnenkort kunt u hier uw afspraken inzien en beheren.
              </p>
              <Button variant="outline" disabled>Nieuwe afspraak maken</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
