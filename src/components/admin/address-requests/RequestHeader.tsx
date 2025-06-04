
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, UserX } from "lucide-react";

interface RequestHeaderProps {
  companyName: string;
  userId: string | null;
  preferredAddressType: string;
  businessType: string;
  status: string;
  onStatusChange: (value: string) => void;
}

const RequestHeader = ({ 
  companyName, 
  userId, 
  preferredAddressType, 
  businessType, 
  status, 
  onStatusChange 
}: RequestHeaderProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "In behandeling", variant: "secondary" as const },
      processing: { label: "Wordt verwerkt", variant: "default" as const },
      approved: { label: "Goedgekeurd", variant: "destructive" as const },
      rejected: { label: "Afgewezen", variant: "destructive" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPackageLabel = (type: string) => {
    const packages = {
      basic: "Basis Pakket (€59/maand)",
      premium: "Premium Pakket (€89/maand)", 
      complete: "Complete Pakket (€149/maand)"
    };
    return packages[type as keyof typeof packages] || type;
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {companyName}
          {!userId && (
            <Badge variant="outline" className="ml-2 text-xs">
              <UserX className="h-3 w-3 mr-1" />
              Anonieme aanvraag
            </Badge>
          )}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {getPackageLabel(preferredAddressType)} • {businessType}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge(status)}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">In behandeling</SelectItem>
            <SelectItem value="processing">Wordt verwerkt</SelectItem>
            <SelectItem value="approved">Goedgekeurd</SelectItem>
            <SelectItem value="rejected">Afgewezen</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RequestHeader;
