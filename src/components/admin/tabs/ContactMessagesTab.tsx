
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, User, Clock, MessageCircle, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ContactMessage } from "@/hooks/use-realtime-notifications";

const ContactMessagesTab = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        toast({
          title: "Fout bij laden",
          description: "Er was een probleem bij het laden van de berichten.",
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Fout bij laden",
        description: "Er was een onbekende fout bij het laden van de berichten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    setUpdating(messageId);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
        toast({
          title: "Fout bij bijwerken",
          description: "Er was een probleem bij het bijwerken van de status.",
          variant: "destructive",
        });
        return;
      }

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: newStatus }
            : msg
        )
      );

      toast({
        title: "Status bijgewerkt",
        description: "De berichtstatus is succesvol bijgewerkt.",
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Fout bij bijwerken",
        description: "Er was een onbekende fout bij het bijwerken.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const updateAdminNotes = async (messageId: string, notes: string) => {
    setUpdating(messageId);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating admin notes:', error);
        toast({
          title: "Fout bij opslaan",
          description: "Er was een probleem bij het opslaan van de notities.",
          variant: "destructive",
        });
        return;
      }

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, admin_notes: notes }
            : msg
        )
      );

      toast({
        title: "Notities opgeslagen",
        description: "De admin notities zijn succesvol opgeslagen.",
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Fout bij opslaan",
        description: "Er was een onbekende fout bij het opslaan.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h2 className="text-2xl font-bold">Contact Berichten</h2>
        <p className="text-gray-600">Beheer en behandel contact berichten van klanten</p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Geen berichten
            </h3>
            <p className="text-gray-600">
              Er zijn momenteel geen contact berichten ontvangen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{message.email}</span>
                        </div>
                        {message.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{message.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(message.created_at).toLocaleString('nl-NL')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(message.status)}>
                      {message.status === 'unread' && 'Ongelezen'}
                      {message.status === 'read' && 'Gelezen'}
                      {message.status === 'replied' && 'Beantwoord'}
                      {message.status === 'closed' && 'Afgesloten'}
                    </Badge>
                    <Select 
                      value={message.status} 
                      onValueChange={(value) => updateMessageStatus(message.id, value)}
                      disabled={updating === message.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Ongelezen</SelectItem>
                        <SelectItem value="read">Gelezen</SelectItem>
                        <SelectItem value="replied">Beantwoord</SelectItem>
                        <SelectItem value="closed">Afgesloten</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Bericht:</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Admin Notities:</h4>
                  <div className="flex gap-2">
                    <Textarea
                      value={message.admin_notes || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMessages(prev => 
                          prev.map(msg => 
                            msg.id === message.id 
                              ? { ...msg, admin_notes: value }
                              : msg
                          )
                        );
                      }}
                      placeholder="Voeg admin notities toe..."
                      className="flex-1"
                      disabled={updating === message.id}
                    />
                    <Button
                      onClick={() => updateAdminNotes(message.id, message.admin_notes || '')}
                      disabled={updating === message.id}
                      className="self-end"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessagesTab;
