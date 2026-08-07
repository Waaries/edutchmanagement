import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Building2,
  FileText,
  Mail,
  Plus,
  ExternalLink,
  Save,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDutchDate } from "@/lib/date-utils";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  MailItem,
  MAIL_STATUS_LABELS,
  MAIL_TYPE_LABELS,
  mailStatusClass,
  mailTypeClass,
} from "@/lib/mail-utils";

interface ProfileForm {
  first_name: string;
  last_name: string;
  company_name: string;
  phone: string;
  business_address: string;
  kvk_number: string;
  vat_number: string;
}

const emptyProfile: ProfileForm = {
  first_name: "",
  last_name: "",
  company_name: "",
  phone: "",
  business_address: "",
  kvk_number: "",
  vat_number: "",
};

const Block = ({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: typeof Mail;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="flex items-center gap-2 text-base text-white">
        <Icon className="h-4 w-4 text-blue-400" />
        {title}
      </CardTitle>
      {action}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const Empty = ({ text }: { text: string }) => (
  <p className="text-sm text-slate-500 py-4">{text}</p>
);

const KlantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [since, setSince] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [contracts, setContracts] = useState<
    { id: string; status: string; created_at: string; access_token: string; client_name: string | null }[]
  >([]);
  const [mail, setMail] = useState<MailItem[]>([]);
  const [requests, setRequests] = useState<
    { id: string; company_name: string; status: string; created_at: string; preferred_address_type: string }[]
  >([]);

  useEffect(() => {
    if (!id) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      const [usersRes, profileRes, contractsRes, mailRes] = await Promise.all([
        supabase.rpc("get_users"),
        supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("filled_contracts")
          .select("id, status, created_at, access_token, client_name")
          .eq("user_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("mail_items")
          .select("*")
          .eq("user_id", id)
          .order("received_at", { ascending: false }),
      ]);

      if (!active) return;

      const account = (usersRes.data ?? []).find((u: { id: string }) => u.id === id);
      const accountEmail = account?.email ?? "";
      setEmail(accountEmail);
      setSince(account?.created_at ?? null);

      const p = profileRes.data;
      if (p) {
        setProfile({
          first_name: p.first_name ?? "",
          last_name: p.last_name ?? "",
          company_name: p.company_name ?? "",
          phone: p.phone ?? "",
          business_address: p.business_address ?? "",
          kvk_number: p.kvk_number ?? "",
          vat_number: p.vat_number ?? "",
        });
      }

      setContracts(contractsRes.data ?? []);
      setMail((mailRes.data ?? []) as MailItem[]);

      // Address requests are linked by user_id, or by e-mail for anonymous submissions
      const reqQuery = supabase
        .from("address_requests")
        .select("id, company_name, status, created_at, preferred_address_type")
        .order("created_at", { ascending: false });
      const { data: reqData } = accountEmail
        ? await reqQuery.or(`user_id.eq.${id},email.eq.${accountEmail}`)
        : await reqQuery.eq("user_id", id);
      if (active) setRequests(reqData ?? []);

      if (active) setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const saveProfile = async () => {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Gegevens opgeslagen" });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-white -ml-2"
        onClick={() => navigate("/beheer/klanten")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Terug naar klanten
      </Button>

      <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
        <h1 className="text-2xl font-bold text-white">
          {profile.company_name || fullName || email || "Klant"}
        </h1>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <p className="text-slate-400">
            Contactpersoon: <span className="text-slate-200">{fullName || "—"}</span>
          </p>
          <p className="text-slate-400">
            E-mail: <span className="text-slate-200">{email || "—"}</span>
          </p>
          <p className="text-slate-400">
            Telefoon: <span className="text-slate-200">{profile.phone || "—"}</span>
          </p>
          <p className="text-slate-400">
            KvK: <span className="text-slate-200">{profile.kvk_number || "—"}</span>
          </p>
          <p className="text-slate-400">
            Klant sinds:{" "}
            <span className="text-slate-200">{since ? formatDutchDate(since) : "—"}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Contract" icon={FileText}>
          {contracts.length === 0 ? (
            <Empty text="Nog geen contract voor deze klant" />
          ) : (
            <div className="space-y-2">
              {contracts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200 truncate">{c.client_name || "Contract"}</p>
                    <p className="text-xs text-slate-500">{formatDutchDate(c.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30">
                      {c.status}
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <a href={`/contract/${c.access_token}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Openen
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Block>

        <Block
          title="Aanvragen"
          icon={Building2}
          action={
            <Button asChild size="sm" variant="ghost" className="text-blue-300">
              <Link to="/beheer/aanvragen">Alles bekijken</Link>
            </Button>
          }
        >
          {requests.length === 0 ? (
            <Empty text="Geen adresaanvragen van deze klant" />
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200 truncate">{r.company_name}</p>
                    <p className="text-xs text-slate-500">
                      {r.preferred_address_type} · {formatDutchDate(r.created_at)}
                    </p>
                  </div>
                  <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 shrink-0">
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Block>
      </div>

      <Block
        title="Post"
        icon={Mail}
        action={
          <Button asChild size="sm">
            <Link to={`/beheer/post?klant=${id}`}>
              <Plus className="h-4 w-4 mr-1" />
              Post registreren voor deze klant
            </Link>
          </Button>
        }
      >
        {mail.length === 0 ? (
          <Empty text="Nog geen post voor deze klant" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400">Onderwerp</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Afzender</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Ontvangen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mail.map((m) => (
                <TableRow key={m.id} className="border-white/10">
                  <TableCell className="text-slate-100">{m.subject}</TableCell>
                  <TableCell>
                    <Badge className={mailTypeClass(m.mail_type)}>
                      {MAIL_TYPE_LABELS[m.mail_type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{m.sender || "—"}</TableCell>
                  <TableCell>
                    <Badge className={mailStatusClass(m.status)}>
                      {MAIL_STATUS_LABELS[m.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {formatDutchDate(m.received_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Block>

      <Block title="Gegevens" icon={Building2}>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["first_name", "Voornaam"],
              ["last_name", "Achternaam"],
              ["company_name", "Bedrijfsnaam"],
              ["phone", "Telefoon"],
              ["business_address", "Bedrijfsadres"],
              ["kvk_number", "KvK-nummer"],
              ["vat_number", "BTW-nummer"],
            ] as [keyof ProfileForm, string][]
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-slate-400">{label}</Label>
              <Input
                value={profile[key]}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                className="bg-slate-950/60 border-white/10 text-slate-100"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={saveProfile} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Opslaan..." : "Gegevens opslaan"}
          </Button>
        </div>
      </Block>
    </div>
  );
};

export default KlantDetail;
