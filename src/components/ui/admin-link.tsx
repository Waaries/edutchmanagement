
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
    // Only show the admin link when both user is logged in and isAdmin is true
    if (user && isAdmin) {
      setShowAdmin(true);
      console.log("Admin link should be visible", { isAdmin, userId: user.id });
    } else {
      setShowAdmin(false);
      console.log("Admin link hidden", { isAdmin, userId: user?.id });
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
