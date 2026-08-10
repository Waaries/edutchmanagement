
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Building2, User, Trash2 } from "lucide-react";

interface RequestHeaderProps {
  companyName: string;
  userId: string | null;
  preferredAddressType: string;
  businessType: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
  onDeleteRequest: () => void;
}

const RequestHeader = ({
  companyName,
  userId,
  preferredAddressType,
  businessType,
  status,
  onStatusChange,
  onDeleteRequest
}: RequestHeaderProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "In behandeling", variant: "secondary" as const },
      processing: { label: "Wordt verwerkt", variant: "default" as const },
      approved: { label: "Goedgekeurd", variant: "default" as const },
      rejected: { label: "Afgewezen", variant: "destructive" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPackageLabel = (type: string) => {
    const packages = {
      basic: "Basis Pakket",
      premium: "Premium Pakket", 
      complete: "Complete Pakket"
    };
    return packages[type as keyof typeof packages] || type;
  };

  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <CardTitle className="flex items-center gap-2 mb-2">
          <Building2 className="h-5 w-5" />
          {companyName}
        </CardTitle>
        <CardDescription className="flex items-center gap-4">
          <span>{getPackageLabel(preferredAddressType)} • {businessType}</span>
          {userId ? (
            <span className="flex items-center gap-1 text-xs">
              <User className="h-3 w-3" />
              User ID: {userId.substring(0, 8)}...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <User className="h-3 w-3" />
              Verwijderde klant of losse aanvraag
            </span>
          )}
        </CardDescription>
      </div>
      
      <div className="flex items-center gap-3">
        {getStatusBadge(status)}
        
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">In behandeling</SelectItem>
            <SelectItem value="processing">Wordt verwerkt</SelectItem>
            <SelectItem value="approved">Goedgekeurd</SelectItem>
            <SelectItem value="rejected">Afgewezen</SelectItem>
          </SelectContent>
        </Select>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Aanvraag verwijderen</AlertDialogTitle>
              <AlertDialogDescription>
                Weet je zeker dat je deze aanvraag wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuleren</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteRequest} className="bg-destructive hover:bg-destructive/90">
                Verwijderen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default RequestHeader;
