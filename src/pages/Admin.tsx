
import { useEffect } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Update the document title
    document.title = "Admin Dashboard | eDutch Management";
    
    console.log('Admin page - Auth state:', { user: !!user, isAdmin, loading });
    
    // Show toast when non-admin tries to access
    if (!loading && user && !isAdmin) {
      toast({
        title: "Toegang geweigerd",
        description: "U heeft geen toegang tot het admin dashboard.",
        variant: "destructive",
      });
    }
  }, [user, isAdmin, loading, toast]);

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

  // If not logged in or not admin, redirect to home
  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return <AdminDashboard />;
};

export default Admin;
