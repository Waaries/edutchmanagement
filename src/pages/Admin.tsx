
import { useEffect, useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(false);
  const [directAdminCheck, setDirectAdminCheck] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Function to manually check admin status using the fixed function
  const checkAdminStatus = async () => {
    if (!user) return;
    
    setCheckingAdmin(true);
    try {
      // Call the is_admin() function through RPC
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error("Admin check error:", error);
        setDebugInfo({ error: error.message, email: user.email });
        setDirectAdminCheck(false);
        setError("Er is een fout opgetreden bij het controleren van uw admin status.");
      } else {
        console.log("Admin check result:", data);
        setDebugInfo({ 
          isAdmin: !!data, 
          email: user.email,
          userId: user.id,
          timestamp: new Date().toISOString(),
          method: "rpc"
        });
        setDirectAdminCheck(!!data);
        
        if (!data) {
          setError("U heeft geen admin rechten voor deze pagina.");
          toast({
            title: "Toegang geweigerd",
            description: "U heeft geen toegang tot het admin dashboard.",
            variant: "destructive",
          });
        } else {
          setError(null);
          
          // Force reload the page to refresh admin components if user is admin
          if (!!data) {
            window.location.reload();
          }
        }
      }
    } catch (err) {
      console.error("Exception during admin check:", err);
      setDebugInfo({ exception: String(err), email: user.email });
      setDirectAdminCheck(false);
      setError("Er is een fout opgetreden bij het controleren van uw admin status.");
    } finally {
      setCheckingAdmin(false);
    }
  };

  useEffect(() => {
    // Update the document title
    document.title = "Admin Dashboard | eDutch Management";
    
    console.log('Admin page - Auth state:', { 
      user: user?.email || '(no user)', 
      userId: user?.id, 
      isAdmin, 
      loading 
    });
  }, [user, isAdmin, loading]);

  // Check admin status when component mounts
  useEffect(() => {
    if (user && !loading) {
      checkAdminStatus();
    }

    // Force redirect to auth page if not logged in after loading completes
    if (!loading && !user) {
      console.log("User is not logged in, redirecting to auth page");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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

  // If admin status checked directly and user is admin, show dashboard
  if (user && (isAdmin || directAdminCheck === true)) {
    return <AdminDashboard />;
  }

  // If not admin, show access denied
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Toegang geweigerd</h2>
        
        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <p className="mb-6">U heeft geen admin rechten of bent niet ingelogd.</p>
        
        {user && (
          <>
            <div className="bg-slate-50 p-4 rounded-md mb-4">
              <h3 className="font-medium mb-2">Gebruikersinformatie:</h3>
              <p>Email: {user.email}</p>
              <p>User ID: {user.id}</p>
              <p>Admin volgens AuthContext: {isAdmin ? 'Ja' : 'Nee'}</p>
              <p>Admin volgens directe check: {directAdminCheck === null ? 'Nog niet gecontroleerd' : directAdminCheck ? 'Ja' : 'Nee'}</p>
            </div>
            
            <div className="mb-4">
              <Button 
                onClick={checkAdminStatus}
                disabled={checkingAdmin}
                className="w-full"
              >
                {checkingAdmin ? 'Controleren...' : 'Controleer admin status opnieuw'}
              </Button>
            </div>
            
            {debugInfo && (
              <div className="bg-slate-50 p-4 rounded-md overflow-auto max-h-48 text-xs">
                <h3 className="font-medium mb-2">Debug Informatie:</h3>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="w-full mb-2"
              >
                Naar dashboard
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Terug naar homepage
              </Button>
            </div>
          </>
        )}
        
        {!user && (
          <div className="mt-4">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Inloggen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
