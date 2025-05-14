
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
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const UsersTable = () => {
  const { users, loading, fetchUsers } = useUsersData();
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 5;

  // Refresh data when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last and pages around current page
    if (i === 1 || i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
  }

  if (loading) {
    return <UsersTableLoading />;
  }

  return (
    <>
      {/* Search bar */}
      <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
        <Input
          type="search"
          placeholder="Zoek op e-mail..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Zoeken
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <UsersTableHeader />
          <TableBody>
            {currentUsers.length === 0 ? (
              searchTerm ? 
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    Geen resultaten gevonden voor "{searchTerm}"
                  </td>
                </tr> : 
                <EmptyUsersList />
            ) : (
              currentUsers.map((user) => (
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
      
      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)} 
                />
              </PaginationItem>
            )}
            
            {paginationItems}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
      
      <DeleteUserDialog 
        userToDelete={userToDelete}
        onClose={handleCloseDeleteDialog}
        onSuccess={fetchUsers}
      />
    </>
  );
};

export default UsersTable;
