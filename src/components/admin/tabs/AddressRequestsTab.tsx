
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useAdminAddressRequests } from "@/hooks/use-admin-address-requests";
import RequestCard from "../address-requests/RequestCard";

const AddressRequestsTab = () => {
  const { requests, loading, updateRequestStatus, updateAdminNotes, deleteRequest } = useAdminAddressRequests();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bedrijfsadres Aanvragen</h2>
        <p className="text-gray-600">Beheer en behandel aanvragen voor bedrijfsadressen</p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen aanvragen</h3>
            <p className="text-gray-600">Er zijn momenteel geen bedrijfsadres aanvragen.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onStatusChange={updateRequestStatus}
              onUpdateNotes={updateAdminNotes}
              onDeleteRequest={deleteRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressRequestsTab;
