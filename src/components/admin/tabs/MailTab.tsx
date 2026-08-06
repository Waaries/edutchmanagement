import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formatDutchDate } from "@/lib/date-utils";
import { Loader2, Trash2, Plus, FileText } from "lucide-react";
import {
  MailItem,
  MailStatus,
  MailType,
  MailPriority,
  MAIL_STATUS_LABELS,
  MAIL_TYPE_LABELS,
  MAIL_PRIORITY_LABELS,
  mailStatusClass,
  mailTypeClass,
  mailPriorityClass,
} from "@/lib/mail-utils";

interface AdminUser {
  id: string;
  email: string;
}

const emptyForm = {
  user_id: "",
  subject: "",
  sender: "",
  mail_type: "letter" as MailType,
  priority: "normal" as MailPriority,
  received_at: new Date().toISOString().slice(0, 10),
  notes: "",
};

const MailTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [items, setItems] = useState<MailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [filterUser, setFilterUser] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const emailById = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach((u) => map.set(u.id, u.email));
    return map;
  }, [users]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [usersRes, mailRes] = await Promise.all([
        supabase.rpc("get_users"),
        supabase.from("mail_items").select("*").order("received_at", { ascending: false }),
      ]);
      if (usersRes.error) throw usersRes.error;
      if (mailRes.error) throw mailRes.error;
      setUsers(
        (usersRes.data ?? []).map((u: { id: string; email: string }) => ({
          id: u.id,
          email: u.email,
        }))
      );
      setItems((mailRes.data ?? []) as MailItem[]);
    } catch (error) {
      console.error("Error loading mail data:", error);
      toast({
        title: "Fout bij laden",
        description: "De postgegevens konden niet worden geladen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user_id || !form.subject.trim()) {
      toast({
        title: "Ontbrekende gegevens",
        description: "Selecteer een klant en vul een onderwerp in.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      let scanPath: string | null = null;

      if (scanFile) {
        const ext = scanFile.name.split(".").pop() ?? "pdf";
        scanPath = `${form.user_id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("mail-scans")
          .upload(scanPath, scanFile, { upsert: false });
        if (uploadError) throw uploadError;
      }

      const { error } = await supabase.from("mail_items").insert({
        user_id: form.user_id,
        subject: form.subject.trim(),
        sender: form.sender.trim() || null,
        mail_type: form.mail_type,
        priority: form.priority,
        status: scanPath ? "scanned" : "received",
        received_at: new Date(form.received_at).toISOString(),
        notes: form.notes.trim() || null,
        scan_url: scanPath,
        registered_by: user?.id ?? null,
      });
      if (error) throw error;

      toast({ title: "Post geregistreerd", description: "Het poststuk is opgeslagen." });
      setForm(emptyForm);
      setScanFile(null);
      loadAll();
    } catch (error) {
      console.error("Error registering mail:", error);
      toast({
        title: "Fout bij opslaan",
        description: "Het poststuk kon niet worden geregistreerd.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: MailStatus) => {
    const previous = items;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    const { error } = await supabase.from("mail_items").update({ status }).eq("id", id);
    if (error) {
      console.error("Error updating status:", error);
      setItems(previous);
      toast({
        title: "Fout bij bijwerken",
        description: "De status kon niet worden gewijzigd.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: MailItem) => {
    if (!confirm(`Poststuk "${item.subject}" definitief verwijderen?`)) return;
    const { error } = await supabase.from("mail_items").delete().eq("id", item.id);
    if (error) {
      console.error("Error deleting mail:", error);
      toast({
        title: "Fout bij verwijderen",
        description: "Het poststuk kon niet worden verwijderd.",
        variant: "destructive",
      });
      return;
    }
    if (item.scan_url) {
      await supabase.storage.from("mail-scans").remove([item.scan_url]);
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    toast({ title: "Verwijderd", description: "Het poststuk is verwijderd." });
  };

  const handleOpenScan = async (item: MailItem) => {
    if (!item.scan_url) return;
    const { data, error } = await supabase.storage
      .from("mail-scans")
      .createSignedUrl(item.scan_url, 300);
    if (error || !data) {
      toast({
        title: "Scan niet beschikbaar",
        description: "De scan kon niet worden geopend.",
        variant: "destructive",
      });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const filtered = items.filter(
    (i) =>
      (filterUser === "all" || i.user_id === filterUser) &&
      (filterStatus === "all" || i.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      {/* Register form */}
      <Card className="bg-slate-900/60 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-400" /> Post registreren
          </CardTitle>
          <CardDescription>Leg een ontvangen poststuk vast voor een klant</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Klant</Label>
              <Select
                value={form.user_id}
                onValueChange={(v) => setForm((f) => ({ ...f, user_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een klant" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mail-subject">Onderwerp</Label>
              <Input
                id="mail-subject"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Bijv. Brief Belastingdienst"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mail-sender">Afzender</Label>
              <Input
                id="mail-sender"
                value={form.sender}
                onChange={(e) => setForm((f) => ({ ...f, sender: e.target.value }))}
                placeholder="Bijv. Belastingdienst"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.mail_type}
                onValueChange={(v) => setForm((f) => ({ ...f, mail_type: v as MailType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MAIL_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioriteit</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm((f) => ({ ...f, priority: v as MailPriority }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MAIL_PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mail-date">Ontvangstdatum</Label>
              <Input
                id="mail-date"
                type="date"
                value={form.received_at}
                onChange={(e) => setForm((f) => ({ ...f, received_at: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mail-notes">Notities</Label>
              <Textarea
                id="mail-notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Aanvullende informatie voor de klant"
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mail-scan">Scan (optioneel)</Label>
              <Input
                id="mail-scan"
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setScanFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={saving} className="flex items-center gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Post registreren
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Overview */}
      <Card className="bg-slate-900/60 border-white/10">
        <CardHeader>
          <CardTitle>Geregistreerde post</CardTitle>
          <CardDescription>Alle post die voor klanten is vastgelegd</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="sm:w-64">
                <SelectValue placeholder="Filter op klant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle klanten</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="sm:w-52">
                <SelectValue placeholder="Filter op status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                {Object.entries(MAIL_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="rounded-md border border-white/10 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Klant</TableHead>
                    <TableHead>Onderwerp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Prioriteit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDutchDate(item.received_at)}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {emailById.get(item.user_id) ?? item.user_id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate">
                        <span className={item.is_read ? "" : "font-semibold"}>{item.subject}</span>
                        <div className="text-xs text-slate-400 truncate">
                          {item.sender || "Onbekende afzender"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={mailTypeClass(item.mail_type)}>
                          {MAIL_TYPE_LABELS[item.mail_type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={mailPriorityClass(item.priority)}>
                          {MAIL_PRIORITY_LABELS[item.priority]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(v) => handleStatusChange(item.id, v as MailStatus)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MAIL_STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {item.scan_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenScan(item)}
                            title="Scan bekijken"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item)}
                          title="Verwijderen"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                        Geen post gevonden
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && (
            <p className="text-xs text-slate-500">
              {filtered.length} van {items.length} poststukken
              {items.filter((i) => !i.is_read).length > 0 &&
                ` · ${items.filter((i) => !i.is_read).length} nog niet gelezen door de klant`}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MailTab;
