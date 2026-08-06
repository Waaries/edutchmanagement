import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDutchDate } from "@/lib/date-utils";
import { Mail, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  MailItem,
  MAIL_TYPE_LABELS,
  MAIL_STATUS_LABELS,
  MAIL_PRIORITY_LABELS,
  mailTypeClass,
  mailStatusClass,
  mailPriorityClass,
} from "@/lib/mail-utils";

const AppointmentsTab = () => {
  const [mailItems, setMailItems] = useState<MailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const fetchMailItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("mail_items")
          .select("*")
          .eq("user_id", user.id)
          .order("received_at", { ascending: false });

        if (error) throw error;
        setMailItems((data ?? []) as MailItem[]);
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
  }, [user, toast]);

  const handleViewMail = useCallback(
    async (mail: MailItem) => {
      setSelectedMail(mail);

      if (!mail.is_read) {
        setMailItems((prev) =>
          prev.map((item) => (item.id === mail.id ? { ...item, is_read: true } : item))
        );
        const { error } = await supabase
          .from("mail_items")
          .update({ is_read: true })
          .eq("id", mail.id);
        if (error) console.error("Error marking mail as read:", error);
      }
    },
    []
  );

  const handleOpenScan = async (mail: MailItem) => {
    if (!mail.scan_url) return;
    try {
      setScanLoading(true);
      const { data, error } = await supabase.storage
        .from("mail-scans")
        .createSignedUrl(mail.scan_url, 60 * 5);
      if (error) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening scan:", error);
      toast({
        title: "Scan niet beschikbaar",
        description: "De scan kon niet worden geopend. Neem contact met ons op.",
        variant: "destructive",
      });
    } finally {
      setScanLoading(false);
    }
  };

  const unreadCount = mailItems.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ontvangen post</CardTitle>
          <CardDescription>
            Post die eDutch Management voor u heeft ontvangen en geregistreerd
            {unreadCount > 0 && ` · ${unreadCount} ongelezen`}
          </CardDescription>
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
                <div className="bg-white/5 border border-white/10 rounded-md p-4 h-[420px] overflow-y-auto">
                  <h3 className="font-medium mb-4">Uw ontvangen post ({mailItems.length})</h3>
                  <div className="space-y-2">
                    {mailItems.map((mail) => (
                      <div
                        key={mail.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedMail?.id === mail.id
                            ? "bg-blue-500/10 border-blue-500/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        } ${!mail.is_read ? "border-l-4 border-l-blue-500" : ""}`}
                        onClick={() => handleViewMail(mail)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className={`truncate ${!mail.is_read ? "font-bold" : "font-medium"}`}>
                              {mail.subject}
                            </h4>
                            <p className="text-sm text-slate-400 truncate">
                              {mail.sender || "Onbekende afzender"} · {formatDutchDate(mail.received_at)}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="outline" className={mailTypeClass(mail.mail_type)}>
                                {MAIL_TYPE_LABELS[mail.mail_type]}
                              </Badge>
                              <Badge variant="outline" className={mailStatusClass(mail.status)}>
                                {MAIL_STATUS_LABELS[mail.status]}
                              </Badge>
                            </div>
                          </div>
                          <Mail
                            className={`h-5 w-5 shrink-0 ${
                              !mail.is_read ? "text-blue-400" : "text-slate-500"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mail content column */}
              <div className="md:col-span-2">
                <div className="bg-white/5 border border-white/10 rounded-md p-6 h-[420px] overflow-y-auto">
                  {selectedMail ? (
                    <div>
                      <h2 className="text-xl font-bold mb-3">{selectedMail.subject}</h2>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className={mailTypeClass(selectedMail.mail_type)}>
                          {MAIL_TYPE_LABELS[selectedMail.mail_type]}
                        </Badge>
                        <Badge variant="outline" className={mailStatusClass(selectedMail.status)}>
                          {MAIL_STATUS_LABELS[selectedMail.status]}
                        </Badge>
                        <Badge variant="outline" className={mailPriorityClass(selectedMail.priority)}>
                          Prioriteit: {MAIL_PRIORITY_LABELS[selectedMail.priority]}
                        </Badge>
                      </div>

                      <div className="mb-6 text-sm text-slate-400 space-y-1">
                        <p>
                          <strong className="text-slate-300">Van:</strong>{" "}
                          {selectedMail.sender || "Onbekend"}
                        </p>
                        <p>
                          <strong className="text-slate-300">Ontvangen op:</strong>{" "}
                          {formatDutchDate(selectedMail.received_at)}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-300 mb-1">Notities</h3>
                          <p className="text-slate-400 whitespace-pre-wrap">
                            {selectedMail.notes || "Geen aanvullende notities bij dit poststuk."}
                          </p>
                        </div>

                        {selectedMail.scan_url && (
                          <Button
                            onClick={() => handleOpenScan(selectedMail)}
                            disabled={scanLoading}
                            className="flex items-center gap-2"
                          >
                            {scanLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            <span>Scan bekijken</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Mail className="h-12 w-12 text-slate-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Geen post geselecteerd</h3>
                      <p className="text-slate-400 max-w-md">
                        Selecteer een item uit de lijst om de details te bekijken
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nog geen post ontvangen</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Zodra eDutch Management post voor u ontvangt, verschijnt deze hier automatisch.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsTab;
