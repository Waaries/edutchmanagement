
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function AdminLink() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) return null;
  
  return (
    <Button variant="ghost" asChild className="flex items-center gap-2">
      <Link to="/admin">
        <Shield className="h-4 w-4" />
        <span>Admin</span>
      </Link>
    </Button>
  );
}
