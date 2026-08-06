
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddressRequest } from "@/hooks/use-admin-address-requests";
import { devLog } from "@/lib/logger";

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
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      devLog("[Notifications] User is not admin, skipping real-time setup");
      return;
    }

    devLog("[Notifications] Setting up real-time notifications for admin user");
    
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
          devLog('[Notifications] New address request received:', payload);
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
          devLog('[Notifications] Address request updated:', payload);
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
          devLog('[Notifications] New contact message received:', payload);
          const newMessage = payload.new as ContactMessage;
          
          toast({
            title: "Nieuw Contact Bericht",
            description: `${newMessage.name} heeft een bericht gestuurd.`,
          });
          
          setContactNotifications(prev => [...prev, newMessage.id]);
        }
      )
      .subscribe((status, err) => {
        devLog('[Notifications] Subscription status:', status);
        if (err) {
          console.error('[Notifications] Subscription error:', err);
        } else {
          setIsSubscribed(status === 'SUBSCRIBED');
          devLog('[Notifications] Successfully subscribed to admin-notifications channel');
        }
      });

    return () => {
      devLog('[Notifications] Cleaning up real-time subscription');
      supabase.removeChannel(channel);
      setIsSubscribed(false);
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
    clearAllNotifications,
    isSubscribed
  };
};
