
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Building2, Mail, Phone, User, MessageSquare } from "lucide-react";

interface AddressRequest {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  preferred_address_type: string;
  business_type: string;
  expected_mail_volume: string;
  additional_services: string[];
  special_requirements: string;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

const AddressRequestsTab = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AddressRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('address_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Fout bij laden",
        description: "Er is een fout opgetreden bij het laden van de aanvragen.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('address_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        throw error;
      }

      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));

      toast({
        title: "Status bijgewerkt",
        description: "De status van de aanvraag is succesvol bijgewerkt.",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Fout bij bijwerken",
        description: "Er is een fout opgetreden bij het bijwerken van de status.",
        variant: "destructive"
      });
    }
  };

  const updateAdminNotes = async (requestId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('address_requests')
        .update({ admin_notes: notes })
        .eq('id', requestId);

      if (error) {
        throw error;
      }

      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, admin_notes: notes } : req
      ));

      setEditingNotes(null);
      setTempNotes("");

      toast({
        title: "Notitie opgeslagen",
        description: "De admin notitie is succesvol opgeslagen.",
      });
    } catch (error) {
      console.error("Error updating notes:", error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de notitie.",
        variant: "destructive"
      });
    }
  };

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
      basic: "Basis Pakket (€29/maand)",
      premium: "Premium Pakket (€49/maand)", 
      complete: "Complete Pakket (€79/maand)"
    };
    return packages[type as keyof typeof packages] || type;
  };

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
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {request.company_name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {getPackageLabel(request.preferred_address_type)} • {request.business_type}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status)}
                    <Select 
                      value={request.status} 
                      onValueChange={(value) => updateRequestStatus(request.id, value)}
                    >
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
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{request.contact_person}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{request.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{request.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(request.created_at).toLocaleDateString('nl-NL')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Verwacht postvolume:</span> {request.expected_mail_volume}
                  </div>
                  
                  {request.additional_services?.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Extra diensten:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.additional_services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.special_requirements && (
                    <div className="text-sm">
                      <span className="font-medium">Bijzondere wensen:</span>
                      <p className="text-gray-600 mt-1 bg-gray-50 p-2 rounded">{request.special_requirements}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Admin notitie:
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingNotes(request.id);
                          setTempNotes(request.admin_notes || "");
                        }}
                      >
                        {request.admin_notes ? "Bewerken" : "Toevoegen"}
                      </Button>
                    </div>
                    
                    {editingNotes === request.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Voeg een notitie toe voor de klant..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateAdminNotes(request.id, tempNotes)}
                          >
                            Opslaan
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingNotes(null);
                              setTempNotes("");
                            }}
                          >
                            Annuleren
                          </Button>
                        </div>
                      </div>
                    ) : (
                      request.admin_notes && (
                        <p className="text-sm bg-blue-50 p-3 rounded-md text-blue-800">
                          {request.admin_notes}
                        </p>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4 pt-4 border-t">
                  <Clock className="h-3 w-3" />
                  <span>
                    Laatst bijgewerkt: {new Date(request.updated_at).toLocaleDateString('nl-NL')} om {new Date(request.updated_at).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressRequestsTab;
