
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LayoutDashboard, Mail, Settings, Building2 } from "lucide-react";

// Import components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import OverviewTab from "@/components/dashboard/OverviewTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import AppointmentsTab from "@/components/dashboard/AppointmentsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import AddressRequestsTab from "@/components/dashboard/AddressRequestsTab";
import { useToast } from "@/hooks/use-toast";
import { ensureProfileExists } from "@/lib/profile-utils";

const Dashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Update the document title
    document.title = "Dashboard | eDutch Management";
    
    console.log('Dashboard page - Auth state:', { 
      user: !!user, 
      loading,
      isAdmin 
    });

    // Force redirect to auth page if not logged in after loading completes
    if (!loading && !user) {
      console.log("User is not logged in, redirecting to auth page");
      navigate("/auth");
    }
    
    // Zorg ervoor dat het gebruikersprofiel bestaat
    const initProfile = async () => {
      if (user) {
        const profileCreated = await ensureProfileExists(user);
        if (profileCreated) {
          console.log("Profile ensured for user:", user.email);
        } else {
          console.warn("Could not ensure profile for user:", user.email);
        }
      }
    };
    
    initProfile();
  }, [user, loading, isAdmin, navigate]);

  // Show a loading indicator while checking authentication
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

  return (
    <div className="container mx-auto py-8 px-4 pt-32">
      <DashboardHeader isAdmin={isAdmin} />
      
      <WelcomeCard user={user} isAdmin={isAdmin} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overzicht</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profiel</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Aanvragen</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Ontvangen post</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Instellingen</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab setActiveTab={setActiveTab} />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileTab user={user} />
        </TabsContent>
        
        <TabsContent value="requests">
          <AddressRequestsTab />
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
