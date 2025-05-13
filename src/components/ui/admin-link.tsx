
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminLink() {
  const { isAdmin, user } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  
  useEffect(() => {
    if (user && isAdmin) {
      setShowAdmin(true);
      console.log("Admin link should be visible", { isAdmin, userId: user.id });
    } else {
      setShowAdmin(false);
    }
  }, [isAdmin, user]);
  
  if (!showAdmin) return null;
  
  return (
    <Button variant="ghost" asChild className="flex items-center gap-2">
      <Link to="/admin">
        <Shield className="h-4 w-4" />
        <span>Admin</span>
      </Link>
    </Button>
  );
}
