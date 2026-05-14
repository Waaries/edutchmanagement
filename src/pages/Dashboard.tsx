
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { User, LayoutDashboard, Mail, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const DASH_NAV = [
  { value: "overview", label: "Overzicht", icon: LayoutDashboard },
  { value: "profile", label: "Profiel", icon: User },
  { value: "appointments", label: "Ontvangen post", icon: Mail },
  { value: "settings", label: "Instellingen", icon: Settings },
];
import { updateMetaTags, pageSEO } from "@/lib/seo";

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
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <p className="text-red-400 mb-4">Authenticatiefout opgetreden</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90"
          >
            Terug naar inloggen
          </button>
        </div>
      </div>
    );
  }

  const { user, loading, isAdmin, initialized } = authContext;

  useEffect(() => {
    updateMetaTags(pageSEO.dashboard);
    
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-400">Bezig met laden...</p>
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
      <div className="container mx-auto py-8 px-4">
        <DashboardHeader isAdmin={isAdmin} />
        
        <WelcomeCard user={user} isAdmin={isAdmin} />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="flex flex-col lg:flex-row gap-6"
        >
          <aside className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-20 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-3">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Menu
              </p>
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {DASH_NAV.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => setActiveTab(item.value)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-left w-full",
                        active
                          ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-blue-200 border border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]"
                          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab setActiveTab={setActiveTab} />
            </TabsContent>
            <TabsContent value="profile" className="mt-0">
              <ProfileTab user={user} />
            </TabsContent>
            <TabsContent value="appointments" className="mt-0">
              <AppointmentsTab />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
