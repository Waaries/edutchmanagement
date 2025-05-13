
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const UsersTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Email</TableHead>
        <TableHead>Aangemaakt op</TableHead>
        <TableHead>Laatste inlog</TableHead>
        <TableHead>Admin</TableHead>
        <TableHead className="text-right">Acties</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UsersTableHeader;
