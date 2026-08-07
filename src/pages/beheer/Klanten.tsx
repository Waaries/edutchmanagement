import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, UserPlus, RefreshCw, Shield, X, Mail, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formatDutchDate } from "@/lib/date-utils";
import { UserData } from "@/types/user";
import CreateUserDialog from "@/components/admin/CreateUserDialog";
import DeleteUserDialog from "@/components/admin/DeleteUserDialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import PageHeader from "./PageHeader";

interface CustomerRow extends UserData {
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  phone: string | null;
  unread_mail: number;
}

const Klanten = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<CustomerRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const load = async () => {
    setRows(null);
    const [usersRes, profilesRes, rolesRes, mailRes] = await Promise.all([
      supabase.rpc("get_users"),
      supabase.from("profiles").select("id, first_name, last_name, company_name, phone"),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("mail_items").select("user_id, is_read"),
    ]);

    if (usersRes.error) {
      toast({
        title: "Fout bij laden",
        description: "De klantgegevens konden niet worden geladen.",
        variant: "destructive",
      });
      setRows([]);
      return;
    }

    const profiles = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));
    const admins = new Set(
      (rolesRes.data ?? []).filter((r) => r.role === "admin").map((r) => r.user_id)
    );
    const unread = new Map<string, number>();
    (mailRes.data ?? []).forEach((m) => {
      if (!m.is_read) unread.set(m.user_id, (unread.get(m.user_id) ?? 0) + 1);
    });

    setRows(
      (usersRes.data ?? []).map((u) => {
        const p = profiles.get(u.id);
        return {
          ...u,
          is_admin: admins.has(u.id),
          first_name: p?.first_name ?? null,
          last_name: p?.last_name ?? null,
          company_name: p?.company_name ?? null,
          phone: p?.phone ?? null,
          unread_mail: unread.get(u.id) ?? 0,
        };
      })
    );
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAdmin = async (row: CustomerRow) => {
    setProcessing(row.id);
    const { error } = row.is_admin
      ? await supabase.rpc("remove_admin_role", { user_id_param: row.id })
      : await supabase.rpc("add_admin_role", { user_id_param: row.id });
    setProcessing(null);
    if (error) {
      toast({ title: "Actie mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: row.is_admin ? "Adminrechten ingetrokken" : "Adminrechten toegekend",
    });
    load();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || !rows) return rows ?? [];
    return rows.filter((r) =>
      [r.email, r.company_name, r.first_name, r.last_name]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const displayName = (r: CustomerRow) =>
    [r.first_name, r.last_name].filter(Boolean).join(" ") || "—";

  return (
    <div>
      <PageHeader title="Klanten" description="Klantenbestand en accounts" />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op naam, e-mail of bedrijfsnaam"
            className="pl-9 bg-slate-900/60 border-white/10 text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nieuwe gebruiker
        </Button>
        <Button size="sm" variant="outline" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Ververs
        </Button>
      </div>

      <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl">
        <CardContent className="p-0">
          {!rows ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">Geen klanten gevonden</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400">Klant</TableHead>
                  <TableHead className="text-slate-400">Bedrijf</TableHead>
                  <TableHead className="text-slate-400">E-mail</TableHead>
                  <TableHead className="text-slate-400">Klant sinds</TableHead>
                  <TableHead className="text-slate-400">Ongelezen post</TableHead>
                  <TableHead className="text-slate-400 text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => navigate(`/beheer/klanten/${row.id}`)}
                    className="border-white/10 cursor-pointer hover:bg-white/5"
                  >
                    <TableCell className="text-slate-100 font-medium">
                      <span className="flex items-center gap-2">
                        {displayName(row)}
                        {row.is_admin && (
                          <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30">
                            Admin
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300">{row.company_name || "—"}</TableCell>
                    <TableCell className="text-slate-300">{row.email}</TableCell>
                    <TableCell className="text-slate-400">
                      {formatDutchDate(row.created_at)}
                    </TableCell>
                    <TableCell>
                      {row.unread_mail > 0 ? (
                        <span className="inline-flex items-center gap-1 text-blue-300 text-sm">
                          <Mail className="h-3.5 w-3.5" />
                          {row.unread_mail}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={processing === row.id}
                          onClick={() => toggleAdmin(row)}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {row.is_admin ? "Admin intrekken" : "Maak admin"}
                        </Button>
                        {currentUser?.id !== row.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => setUserToDelete(row)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Verwijderen
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/beheer/klanten/${row.id}`)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} onUserCreated={load} />
      <DeleteUserDialog
        userToDelete={userToDelete}
        onClose={() => setUserToDelete(null)}
        onSuccess={() => {
          setUserToDelete(null);
          load();
        }}
      />
    </div>
  );
};

export default Klanten;
