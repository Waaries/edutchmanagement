
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDutchDate } from "@/lib/date-utils";
import { Mail, Trash, Eye, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Define the mail item type
interface MailItem {
  id: number;
  title: string;
  sender: string;
  receivedDate: string;
  status: "unread" | "read";
  priority: "normal" | "high" | "low";
}

// No test data - will be populated from database in future implementation
const SAMPLE_MAIL_ITEMS: MailItem[] = [];

const AppointmentsTab = () => {
  const [mailItems, setMailItems] = useState<MailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch mail items
    const fetchMailItems = async () => {
      try {
        setLoading(true);
        // In a real application, this would be a database or API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setMailItems(SAMPLE_MAIL_ITEMS);
      } catch (error) {
        console.error("Error fetching mail items:", error);
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van uw ontvangen post.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMailItems();
  }, [toast]);

  const handleViewMail = (mail: MailItem) => {
    setSelectedMail(mail);
    
    // Mark as read if it was unread
    if (mail.status === "unread") {
      const updatedMailItems = mailItems.map(item => 
        item.id === mail.id ? { ...item, status: "read" as const } : item
      );
      setMailItems(updatedMailItems);
    }

    toast({
      title: "Post geopend",
      description: `U bekijkt nu: ${mail.title}`,
    });
  };

  const handleDeleteMail = (id: number) => {
    setMailItems(prevItems => prevItems.filter(item => item.id !== id));
    
    if (selectedMail && selectedMail.id === id) {
      setSelectedMail(null);
    }

    toast({
      title: "Post verwijderd",
      description: "Het item is succesvol verwijderd.",
    });
  };

  const handleRegisterNewMail = () => {
    toast({
      title: "Nieuwe post",
      description: "Functionaliteit voor het registreren van nieuwe post volgt binnenkort.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ontvangen post</CardTitle>
            <CardDescription>Bekijk en beheer uw ontvangen post</CardDescription>
          </div>
          <Button 
            onClick={handleRegisterNewMail} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nieuwe post registreren</span>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : mailItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mail list column */}
              <div className="md:col-span-1">
                <div className="bg-slate-50 rounded-md p-4 h-[400px] overflow-y-auto">
                  <h3 className="font-medium mb-4">Uw ontvangen post ({mailItems.length})</h3>
                  <div className="space-y-2">
                    {mailItems.map(mail => (
                      <div
                        key={mail.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedMail?.id === mail.id 
                            ? 'bg-primary/10 border-primary/20' 
                            : 'bg-white hover:bg-slate-100'
                        } ${mail.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}`}
                        onClick={() => handleViewMail(mail)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className={`font-medium ${mail.status === 'unread' ? 'font-bold' : ''}`}>
                              {mail.title}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {mail.sender} · {formatDutchDate(mail.receivedDate)}
                            </p>
                          </div>
                          <Mail className={`h-5 w-5 ${
                            mail.status === 'unread' ? 'text-blue-500' : 'text-slate-400'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mail content column */}
              <div className="md:col-span-2">
                <div className="bg-slate-50 rounded-md p-6 h-[400px] overflow-y-auto">
                  {selectedMail ? (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold">{selectedMail.title}</h2>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteMail(selectedMail.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash className="h-4 w-4" />
                          <span>Verwijderen</span>
                        </Button>
                      </div>
                      
                      <div className="mb-6 text-sm text-slate-500">
                        <p><strong>Van:</strong> {selectedMail.sender}</p>
                        <p><strong>Ontvangen op:</strong> {formatDutchDate(selectedMail.receivedDate)}</p>
                        <p>
                          <strong>Prioriteit:</strong> 
                          <span className={`ml-2 inline-block px-2 py-1 rounded-full text-xs ${
                            selectedMail.priority === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : selectedMail.priority === 'low'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {selectedMail.priority === 'high' 
                              ? 'Hoog' 
                              : selectedMail.priority === 'low'
                                ? 'Laag'
                                : 'Normaal'
                            }
                          </span>
                        </p>
                      </div>
                      
                      <div className="prose max-w-none">
                        <p>Geachte {user?.email?.split('@')[0]},</p>
                        <p>Dit is een voorbeeld van de inhoud van uw ontvangen post. In een echte applicatie zou hier de daadwerkelijke inhoud van het document staan, mogelijk met bijlagen of andere relevante informatie.</p>
                        <p>Deze demo toont hoe u uw ontvangen post kunt bekijken en beheren in het systeem.</p>
                        <p>Met vriendelijke groet,<br />{selectedMail.sender}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Mail className="h-12 w-12 text-slate-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Geen post geselecteerd</h3>
                      <p className="text-slate-500 max-w-md">
                        Selecteer een item uit de lijst om de inhoud te bekijken
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Geen post gevonden</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                U heeft momenteel geen ontvangen post in het systeem geregistreerd.
              </p>
              <Button onClick={handleRegisterNewMail}>
                Nieuwe post registreren
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsTab;
