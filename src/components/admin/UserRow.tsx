
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, UserX, UserMinus, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserData } from "@/types/user";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { formatDutchDate } from "@/lib/date-utils";

type UserRowProps = {
  user: UserData;
  onStatusChange: () => void;
  onDeleteClick: (user: UserData) => void;
};

export const UserRow = ({ user, onStatusChange, onDeleteClick }: UserRowProps) => {
  const { user: currentUser } = useAuth();
  const { isProcessing, toggleAdminStatus } = useAdminStatus(onStatusChange);
  
  // Don't show admin toggle for the current user
  const isCurrentUser = currentUser && currentUser.id === user.id;
  
  const handleToggleAdminStatus = () => {
    toggleAdminStatus(user);
  };

  const handleDeleteClick = () => {
    onDeleteClick(user);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell>{formatDutchDate(user.created_at)}</TableCell>
      <TableCell>{formatDutchDate(user.last_sign_in_at)}</TableCell>
      <TableCell>
        {user.is_admin ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-300" />
        )}
      </TableCell>
      <TableCell className="text-right space-x-2">
        {!isCurrentUser && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleToggleAdminStatus}
            disabled={isProcessing}
            className={user.is_admin ? "text-red-500" : "text-green-500"}
          >
            {user.is_admin ? (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Verwijder admin
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Maak admin
              </>
            )}
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          className="text-red-500 ml-2"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Verwijder
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
