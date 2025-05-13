
import React from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteUserDialog from "./DeleteUserDialog";
import { formatDutchDate } from "@/lib/date-utils";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { UserData } from "@/types/user";
import { Check, X } from "lucide-react"; // Import icons from lucide-react

interface UserRowProps {
  user: UserData;
  refreshUsers: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, refreshUsers }) => {
  const { isProcessing, toggleAdminStatus } = useAdminStatus(refreshUsers);

  const handleToggleAdminStatus = async () => {
    await toggleAdminStatus(user);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{user.email}</TableCell>
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
            <X className="h-5 w-5 text-gray-400 mr-1" />
            <span>Nee</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAdminStatus}
            disabled={isProcessing}
          >
            {user.is_admin ? "Admin rechten intrekken" : "Maak admin"}
          </Button>
          <DeleteUserDialog userId={user.id} userEmail={user.email} onDelete={refreshUsers} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
