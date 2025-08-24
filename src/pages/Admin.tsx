
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admin: React.FC = () => {
  const { user, loading, isAdmin: contextIsAdmin } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Directly verify admin status
  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (loading) return;
      
      if (!user) {
        // Not logged in
        setVerifying(false);
        return;
      }

      try {
        console.log("Admin page - Verifying admin access for:", user.email);
        console.log("Context isAdmin:", contextIsAdmin);
        
        // First check context admin status, then verify with RPC if needed
        if (contextIsAdmin) {
          setIsAdmin(true);
          setError(null);
          setVerifying(false);
          return;
        }
        
        // Wait a bit for auth context to update, then check RPC
        setTimeout(async () => {
          try {
            const { data, error } = await supabase.rpc('is_admin');
            
            if (error) {
              console.error("Admin verification error:", error);
              setError("Er is een fout opgetreden bij het verifiëren van uw toegangsrechten.");
              
              toast({
                title: "Toegangsfout",
                description: "Er is een fout opgetreden bij het verifiëren van uw beheerdersrechten.",
                variant: "destructive",
              });
              setIsAdmin(false);
            } else {
              setError(null);
              console.log("Admin page - is_admin result:", data);
              setIsAdmin(data);
              
              // If user does not have admin role, redirect to dashboard
              if (!data) {
                toast({
                  title: "Toegang geweigerd",
                  description: "U heeft geen toegang tot het admin dashboard.",
                  variant: "destructive",
                });
                navigate('/dashboard');
              }
            }
            setVerifying(false);
          } catch (err) {
            console.error("Exception during admin verification:", err);
            setError("Er is een onbekende fout opgetreden.");
            setIsAdmin(false);
            setVerifying(false);
          }
        }, contextIsAdmin ? 0 : 500); // No delay if context already knows user is admin
      } catch (err) {
        console.error("Exception during admin verification:", err);
        setError("Er is een onbekende fout opgetreden.");
        setIsAdmin(false);
        setVerifying(false);
      }
    };
    
    verifyAdminAccess();
  }, [user, loading, contextIsAdmin, navigate, toast]);
  
  // Show loading indicator while verifying
  if (loading || verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect if user is not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Show error message if there was an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Toegangsfout</h1>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Terug naar Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Only render the admin dashboard if the user has admin privileges
  return isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" replace />;
};

export default Admin;
