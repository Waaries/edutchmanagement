
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AddressRequest } from "@/hooks/use-admin-address-requests";
import RequestHeader from "./RequestHeader";
import RequestDetails from "./RequestDetails";
import AdminNotesSection from "./AdminNotesSection";

interface RequestCardProps {
  request: AddressRequest;
  onStatusChange: (requestId: string, newStatus: string) => Promise<void>;
  onUpdateNotes: (requestId: string, notes: string) => Promise<void>;
  onDeleteRequest: (requestId: string) => Promise<void>;
}

const RequestCard = ({ request, onStatusChange, onUpdateNotes, onDeleteRequest }: RequestCardProps) => {
  const handleStatusChange = (value: string) => {
    onStatusChange(request.id, value);
  };

  const handleDeleteRequest = () => {
    onDeleteRequest(request.id);
  };

  return (
    <Card>
      <CardHeader>
        <RequestHeader
          companyName={request.company_name}
          userId={request.user_id}
          preferredAddressType={request.preferred_address_type}
          businessType={request.business_type}
          status={request.status}
          onStatusChange={handleStatusChange}
          onDeleteRequest={handleDeleteRequest}
        />
      </CardHeader>
      
      <CardContent>
        <RequestDetails
          contactPerson={request.contact_person}
          email={request.email}
          phone={request.phone}
          createdAt={request.created_at}
          updatedAt={request.updated_at}
          expectedMailVolume={request.expected_mail_volume}
          additionalServices={request.additional_services}
          specialRequirements={request.special_requirements}
        />

        <AdminNotesSection
          requestId={request.id}
          adminNotes={request.admin_notes}
          onUpdateNotes={onUpdateNotes}
        />
      </CardContent>
    </Card>
  );
};

export default RequestCard;
