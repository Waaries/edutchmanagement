
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddressRequest } from "@/hooks/use-admin-address-requests";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
  status: string;
  admin_notes?: string;
}

export const useRealtimeNotifications = (isAdmin: boolean) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [contactNotifications, setContactNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('admin-notifications')
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
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          console.log('New contact message:', payload);
          const newMessage = payload.new as ContactMessage;
          
          toast({
            title: "Nieuw Contact Bericht",
            description: `${newMessage.name} heeft een bericht gestuurd.`,
          });
          
          setContactNotifications(prev => [...prev, newMessage.id]);
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

  const clearContactNotification = (messageId: string) => {
    setContactNotifications(prev => prev.filter(id => id !== messageId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setContactNotifications([]);
  };

  // Combine all notifications
  const allNotifications = [...notifications, ...contactNotifications];

  return {
    notifications: allNotifications,
    addressRequestNotifications: notifications,
    contactNotifications,
    clearNotification,
    clearContactNotification,
    clearAllNotifications
  };
};
