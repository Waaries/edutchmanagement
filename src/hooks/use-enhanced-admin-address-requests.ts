
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { devLog } from "@/lib/logger";

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

interface FilterOptions {
  status: string;
  addressType: string;
  businessType: string;
  dateRange: string;
  searchTerm: string;
}

export const useEnhancedAdminAddressRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AddressRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    addressType: 'all',
    businessType: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    fetchRequests();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('admin-address-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'address_requests'
        },
        (payload) => {
          devLog('Real-time update:', payload);
          if (payload.eventType === 'INSERT') {
            setRequests(prev => [payload.new as AddressRequest, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setRequests(prev => prev.map(req => 
              req.id === payload.new.id ? payload.new as AddressRequest : req
            ));
          } else if (payload.eventType === 'DELETE') {
            setRequests(prev => prev.filter(req => req.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Status filter
      if (filters.status !== 'all' && request.status !== filters.status) {
        return false;
      }

      // Address type filter
      if (filters.addressType !== 'all' && request.preferred_address_type !== filters.addressType) {
        return false;
      }

      // Business type filter
      if (filters.businessType !== 'all' && request.business_type !== filters.businessType) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const requestDate = new Date(request.created_at);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            if (requestDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (requestDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (requestDate < monthAgo) return false;
            break;
        }
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          request.company_name.toLowerCase().includes(searchLower) ||
          request.contact_person.toLowerCase().includes(searchLower) ||
          request.email.toLowerCase().includes(searchLower) ||
          request.business_type.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [requests, filters]);

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('address_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        throw error;
      }

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

  const deleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('address_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        throw error;
      }

      toast({
        title: "Aanvraag verwijderd",
        description: "De aanvraag is succesvol verwijderd.",
      });
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden bij het verwijderen van de aanvraag.",
        variant: "destructive"
      });
    }
  };

  return {
    requests: filteredRequests,
    allRequests: requests,
    loading,
    filters,
    setFilters,
    updateRequestStatus,
    updateAdminNotes,
    deleteRequest
  };
};
