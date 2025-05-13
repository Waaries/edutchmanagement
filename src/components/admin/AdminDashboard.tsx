
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Database, Settings } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Log admin access for security monitoring
    if (isAdmin) {
      console.log("Admin dashboard accessed by:", user?.email);
    }
  }, [isAdmin, user]);

  // If not logged in or not admin, redirect to home
  if (!user || !isAdmin) {
    toast({
      title: "Toegang geweigerd",
      description: "U heeft geen toegang tot het admin dashboard.",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welkom, {user.email}</CardTitle>
          <CardDescription>
            U bent ingelogd als beheerder van eDutch Management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Vanuit dit dashboard kunt u alle aspecten van het systeem beheren.</p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Overzicht</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Gebruikers</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Gegevens</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Instellingen</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gebruikers</CardTitle>
                <CardDescription>Beheer gebruikersaccounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Bekijk, bewerk en beheer gebruikersaccounts in het systeem.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("users")}>Bekijk gebruikers</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gegevens</CardTitle>
                <CardDescription>Beheer systeemgegevens</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Bekijk en bewerk de gegevens in het systeem.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("data")}>Bekijk gegevens</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Instellingen</CardTitle>
                <CardDescription>Configureer systeem</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Pas systeeminstellingen en configuratie aan.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("settings")}>Pas instellingen aan</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gebruikersbeheer</CardTitle>
              <CardDescription>Bekijk en beheer gebruikersaccounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Deze functie wordt momenteel ontwikkeld. Binnenkort kunt u hier gebruikers beheren.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Gegevensbeheer</CardTitle>
              <CardDescription>Beheer systeemgegevens</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Deze functie wordt momenteel ontwikkeld. Binnenkort kunt u hier gegevens beheren.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Systeeminstellingen</CardTitle>
              <CardDescription>Configureer het systeem</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Deze functie wordt momenteel ontwikkeld. Binnenkort kunt u hier instellingen beheren.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
