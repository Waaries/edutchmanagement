
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AdminLink() {
  const { isAdmin, user } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  
  useEffect(() => {
    // Simple check based on the auth context state
    // The useAuth hook already verifies with the database
    if (user && isAdmin) {
      setShowAdmin(true);
    } else {
      setShowAdmin(false);
    }
  }, [isAdmin, user]);
  
  if (!showAdmin) return null;
  
  return (
    <Button variant="ghost" asChild className={cn("flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border border-amber-300")}>
      <Link to="/admin">
        <Shield className="h-4 w-4 text-amber-600" />
        <span>Admin Dashboard</span>
      </Link>
    </Button>
  );
}
