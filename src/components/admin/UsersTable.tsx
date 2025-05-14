
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { useUsersData } from "@/hooks/use-users-data";
import { UserData } from "@/types/user";
import UsersTableHeader from "./UsersTableHeader";
import UserRow from "./UserRow";
import EmptyUsersList from "./EmptyUsersList";
import UsersTableLoading from "./UsersTableLoading";
import DeleteUserDialog from "./DeleteUserDialog";

export const UsersTable = () => {
  const { users, loading, fetchUsers } = useUsersData();
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  // Refresh data when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
  };

  const handleStatusChange = () => {
    // Add a small delay to ensure database has updated
    setTimeout(() => {
      fetchUsers();
    }, 500);
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
                  onStatusChange={handleStatusChange}
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
