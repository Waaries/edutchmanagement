
import React from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDutchDate } from "@/lib/date-utils";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { UserData } from "@/types/user";
import { Check, X, User, Shield } from "lucide-react"; 
import { useAuth } from "@/contexts/AuthContext";

interface UserRowProps {
  user: UserData;
  onStatusChange: () => void;
  onDeleteClick: (user: UserData) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onStatusChange, onDeleteClick }) => {
  const { isProcessing, toggleAdminStatus } = useAdminStatus(onStatusChange);
  const { user: currentUser } = useAuth();
  
  // Check if this row represents the current logged in user
  const isCurrentUser = currentUser?.id === user.id;

  const handleToggleAdminStatus = async () => {
    await toggleAdminStatus(user);
  };

  return (
    <TableRow className={isCurrentUser ? "bg-blue-50" : ""}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {isCurrentUser && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs">
              <User className="h-3 w-3 text-blue-500 mr-1" />
              U
            </span>
          )}
          {user.email}
        </div>
      </TableCell>
      <TableCell>{formatDutchDate(user.created_at)}</TableCell>
      <TableCell>{formatDutchDate(user.last_sign_in_at)}</TableCell>
      <TableCell>
        {user.is_admin ? (
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-1" />
            <span>Admin</span>
          </div>
        ) : (
          <div className="flex items-center">
            <X className="h-5 w-5 text-slate-500 mr-1" />
            <span>Nee</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          {/* Only show "Maak admin" button when user is not already an admin */}
          {!user.is_admin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleAdminStatus}
              disabled={isProcessing}
              className="flex items-center gap-1"
            >
              <Shield className="h-3 w-3 text-green-600" />
              Maak admin
            </Button>
          )}
          {/* Only show "Admin rechten intrekken" when user is an admin and not the current user */}
          {user.is_admin && !isCurrentUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleAdminStatus}
              disabled={isProcessing}
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3 text-orange-600" />
              Admin rechten intrekken
            </Button>
          )}
          {/* Only show delete button for non-current users */}
          {!isCurrentUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteClick(user)}
              className="text-destructive flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Verwijderen
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
