
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddressRequest } from "@/hooks/use-admin-address-requests";

export const useRealtimeNotifications = (isAdmin: boolean) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('address-requests-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'address_requests'
        },
        (payload) => {
          console.log('New address request:', payload);
          const newRequest = payload.new as AddressRequest;
          
          toast({
            title: "Nieuwe Aanvraag Ontvangen",
            description: `${newRequest.company_name} heeft een bedrijfsadres aangevraagd.`,
          });
          
          setNotifications(prev => [...prev, newRequest.id]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'address_requests'
        },
        (payload) => {
          console.log('Address request updated:', payload);
          const updatedRequest = payload.new as AddressRequest;
          
          // Only show notification if status changed
          if (payload.old && (payload.old as AddressRequest).status !== updatedRequest.status) {
            toast({
              title: "Status Gewijzigd",
              description: `Status van ${updatedRequest.company_name} is gewijzigd naar ${updatedRequest.status}.`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, toast]);

  const clearNotification = (requestId: string) => {
    setNotifications(prev => prev.filter(id => id !== requestId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    clearNotification,
    clearAllNotifications
  };
};
