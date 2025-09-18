
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LayoutDashboard, Mail, Settings } from "lucide-react";

// Import components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import OverviewTab from "@/components/dashboard/OverviewTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import AppointmentsTab from "@/components/dashboard/AppointmentsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBoundary from "@/components/ErrorBoundary";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Safely get auth context with error handling
  let authContext;
  try {
    authContext = useAuth();
  } catch (err) {
    console.error('Auth context error in Dashboard:', err);
    // Show error state and redirect to auth
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">Authenticatiefout opgetreden</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Terug naar inloggen
          </button>
        </div>
      </div>
    );
  }

  const { user, loading, isAdmin, initialized } = authContext;

  useEffect(() => {
    document.title = "Dashboard | eDutch Management";
    
    console.log('Dashboard page - Auth state:', { 
      user: !!user, 
      loading,
      isAdmin,
      initialized,
      userEmail: user?.email 
    });

    // Only proceed with auth checks if initialized
    if (!initialized) {
      console.log('Auth not yet initialized, waiting...');
      return;
    }

    if (!loading) {
      if (!user) {
        console.log("User is not logged in, redirecting to auth page");
        if (!isRedirecting) {
          setIsRedirecting(true);
          navigate("/auth", { replace: true });
        }
      } else {
        console.log("User is logged in on dashboard");
        setIsRedirecting(false);
      }
    }
  }, [user, loading, isAdmin, initialized, navigate, isRedirecting]);

  // Show loading while auth is initializing or loading
  if (!initialized || loading) {
    console.log("Dashboard: Showing loading state");
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Bezig met laden...</p>
      </div>
    );
  }

  // If not logged in, redirect to auth
  if (!user) {
    console.log("Dashboard: No user, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("Dashboard: Rendering dashboard for user:", user.email);

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8 px-4 pt-32">
        <DashboardHeader isAdmin={isAdmin} />
        
        <WelcomeCard user={user} isAdmin={isAdmin} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Overzicht</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profiel</span>
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
          
          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
