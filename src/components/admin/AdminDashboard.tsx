
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "./AdminHeader";
import WelcomeCard from "./WelcomeCard";
import AdminTabs from "./AdminTabs";
import AdminSecurityCheck from "./AdminSecurityCheck";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show toast only when component mounts, not during render
    if (!user || !isAdmin) {
      setShowToast(true);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    // Display the toast in a useEffect to avoid React state updates during render
    if (showToast) {
      toast({
        title: "Toegang geweigerd",
        description: "U heeft geen toegang tot het admin dashboard.",
        variant: "destructive",
      });
    }
  }, [showToast, toast]);

  // If not logged in or not admin, redirect to home
  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <AdminSecurityCheck user={user} isAdmin={isAdmin}>
      <div className="container mx-auto py-8 px-4">
        <AdminHeader userEmail={user.email || ''} />
        <WelcomeCard userEmail={user.email || ''} />
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </AdminSecurityCheck>
  );
};

export default AdminDashboard;
