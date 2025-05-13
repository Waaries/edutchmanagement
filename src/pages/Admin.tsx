
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
  }, []);

  // If still loading, show nothing yet
  if (loading) {
    return null;
  }

  // If not logged in or not admin, redirect to home
  if (!user || !isAdmin) {
    toast({
      title: "Toegang geweigerd",
      description: "U heeft geen toegang tot het admin dashboard.",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return <AdminDashboard />;
};

export default Admin;
