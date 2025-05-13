
import { useState } from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { useUsersData, type UserData } from "@/hooks/use-users-data";
import UsersTableHeader from "./UsersTableHeader";
import UserRow from "./UserRow";
import EmptyUsersList from "./EmptyUsersList";
import UsersTableLoading from "./UsersTableLoading";
import DeleteUserDialog from "./DeleteUserDialog";

export const UsersTable = () => {
  const { users, loading, fetchUsers } = useUsersData();
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
  };

  if (loading) {
    return <UsersTableLoading />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <UsersTableHeader />
          <TableBody>
            {users.length === 0 ? (
              <EmptyUsersList />
            ) : (
              users.map((user) => (
                <UserRow 
                  key={user.id} 
                  user={user} 
                  onStatusChange={fetchUsers}
                  onDeleteClick={handleDeleteClick}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <DeleteUserDialog 
        userToDelete={userToDelete}
        onClose={handleCloseDeleteDialog}
        onSuccess={fetchUsers}
      />
    </>
  );
};

export default UsersTable;
