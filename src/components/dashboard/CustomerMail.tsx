import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, FileText, Loader2 } from "lucide-react";
import { formatDutchDate } from "@/lib/date-utils";
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

const CustomerMail = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<MailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MailItem | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("mail_items")
        .select("*")
        .eq("user_id", user.id)
        .order("received_at", { ascending: false });

      if (!active) return;
      if (error) {
        toast({
          title: "Fout bij ophalen",
          description: "Uw post kon niet worden geladen.",
          variant: "destructive",
        });
      } else {
        setItems((data ?? []) as MailItem[]);
      }
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [user, toast]);

  const openMail = async (mail: MailItem) => {
    setSelected(mail);
    if (!mail.is_read) {
      setItems((prev) => prev.map((i) => (i.id === mail.id ? { ...i, is_read: true } : i)));
      await supabase.from("mail_items").update({ is_read: true }).eq("id", mail.id);
    }
  };

  const openScan = async (mail: MailItem) => {
    if (!mail.scan_path) return;
    setScanLoading(true);
    const { data, error } = await supabase.storage
      .from("mail-scans")
      .createSignedUrl(mail.scan_path, 300);
    setScanLoading(false);
    if (error || !data) {
      toast({
        title: "Scan niet beschikbaar",
        description: "De scan kon niet worden geopend. Neem contact met ons op.",
        variant: "destructive",
      });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const unread = items.filter((i) => !i.is_read).length;

  return (
    <>
      <Card className="app-card-solid">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2.5 text-white">
            <span className="app-icon-tile h-9 w-9">
              <Mail className="h-4.5 w-4.5" />
            </span>
            Uw post
          </CardTitle>
          {unread > 0 && (
            <Badge className="bg-blue-500/15 text-blue-200 border-blue-500/30">
              {unread} ongelezen
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full bg-white/5" />
              <Skeleton className="h-14 w-full bg-white/5" />
              <Skeleton className="h-14 w-full bg-white/5" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nog geen post</h3>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                Zodra eDutch Management post voor u ontvangt, verschijnt die hier automatisch.
                U krijgt dan direct te zien van wie de post is en wat ermee gebeurt.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop: table */}
              <table className="hidden md:table w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-white/10">
                    <th className="py-2 font-medium">Onderwerp</th>
                    <th className="py-2 font-medium">Afzender</th>
                    <th className="py-2 font-medium">Type</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium">Ontvangen</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => openMail(m)}
                      className="border-b border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors"
                    >
                      <td className="py-3 pr-3">
                        <span className="flex items-center gap-2">
                          {!m.is_read && (
                            <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                          )}
                          <span className={m.is_read ? "text-slate-300" : "text-white font-semibold"}>
                            {m.subject}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-slate-400">{m.sender || "Onbekend"}</td>
                      <td className="py-3 pr-3">
                        <Badge variant="outline" className={mailTypeClass(m.mail_type)}>
                          {MAIL_TYPE_LABELS[m.mail_type]}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge variant="outline" className={mailStatusClass(m.status)}>
                          {MAIL_STATUS_LABELS[m.status]}
                        </Badge>
                      </td>
                      <td className="py-3 text-slate-400 whitespace-nowrap">
                        {formatDutchDate(m.received_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile: cards */}
              <div className="md:hidden space-y-3">
                {items.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => openMail(m)}
                    className={`w-full text-left rounded-xl border p-4 transition-colors ${
                      m.is_read
                        ? "border-white/10 bg-white/5"
                        : "border-blue-500/30 bg-blue-500/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`min-w-0 truncate ${
                          m.is_read ? "text-slate-200" : "text-white font-semibold"
                        }`}
                      >
                        {m.subject}
                      </span>
                      {!m.is_read && (
                        <span className="h-2 w-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {m.sender || "Onbekende afzender"} · {formatDutchDate(m.received_at)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <Badge variant="outline" className={mailTypeClass(m.mail_type)}>
                        {MAIL_TYPE_LABELS[m.mail_type]}
                      </Badge>
                      <Badge variant="outline" className={mailStatusClass(m.status)}>
                        {MAIL_STATUS_LABELS[m.status]}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{selected.subject}</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Van {selected.sender || "onbekende afzender"} ·{" "}
                  {formatDutchDate(selected.received_at)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={mailTypeClass(selected.mail_type)}>
                  {MAIL_TYPE_LABELS[selected.mail_type]}
                </Badge>
                <Badge variant="outline" className={mailStatusClass(selected.status)}>
                  {MAIL_STATUS_LABELS[selected.status]}
                </Badge>
                <Badge variant="outline" className={mailPriorityClass(selected.priority)}>
                  Prioriteit: {MAIL_PRIORITY_LABELS[selected.priority]}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-1">Notities</h4>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">
                  {selected.notes || "Geen aanvullende notities bij dit poststuk."}
                </p>
              </div>

              {selected.scan_path && (
                <Button onClick={() => openScan(selected)} disabled={scanLoading} className="app-btn-primary">
                  {scanLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Scan bekijken
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerMail;
