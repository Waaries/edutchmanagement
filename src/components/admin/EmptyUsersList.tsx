
import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyUsersList = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
        Geen gebruikers gevonden
      </TableCell>
    </TableRow>
  );
};

export default EmptyUsersList;
