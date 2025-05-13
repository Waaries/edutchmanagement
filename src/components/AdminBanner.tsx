
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminBanner = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-primary mr-1" />
          <span className="text-sm font-medium text-primary">Admin Account</span>
        </div>
        <Link to="/admin">
          <Button size="sm" variant="outline" className="h-8">
            Admin Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminBanner;
