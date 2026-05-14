
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useEnhancedAdminAddressRequests } from "@/hooks/use-enhanced-admin-address-requests";
import RequestCard from "../address-requests/RequestCard";
import SearchAndFilters from "../address-requests/SearchAndFilters";

const EnhancedAddressRequestsTab = () => {
  const {
    requests,
    allRequests,
    loading,
    filters,
    setFilters,
    updateRequestStatus,
    updateAdminNotes,
    deleteRequest
  } = useEnhancedAdminAddressRequests();

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
        <p className="text-slate-400">Beheer en behandel aanvragen voor bedrijfsadressen</p>
      </div>

      <SearchAndFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={allRequests.length}
        filteredCount={requests.length}
      />

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Building2 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {allRequests.length === 0 ? "Geen aanvragen" : "Geen resultaten gevonden"}
            </h3>
            <p className="text-slate-400">
              {allRequests.length === 0 
                ? "Er zijn momenteel geen bedrijfsadres aanvragen."
                : "Probeer andere zoektermen of filters te gebruiken."
              }
            </p>
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

export default EnhancedAddressRequestsTab;
