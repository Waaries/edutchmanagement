
import { useEffect } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  useEffect(() => {
    // Update the document title
    document.title = "Admin Dashboard | eDutch Management";
  }, []);

  return <AdminDashboard />;
};

export default Admin;
