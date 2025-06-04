
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AddressRequest {
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
  user_id: string | null;
}

export const useAdminAddressRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AddressRequest[]>([]);
  const [loading, setLoading] = useState(true);

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

  return {
    requests,
    loading,
    updateRequestStatus,
    updateAdminNotes
  };
};
