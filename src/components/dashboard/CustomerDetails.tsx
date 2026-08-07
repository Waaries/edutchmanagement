import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Edit3, Save, X } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProfileData {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  business_address?: string;
  kvk_number?: string;
  vat_number?: string;
}

const FIELDS: [keyof ProfileData, string][] = [
  ["first_name", "Voornaam"],
  ["last_name", "Achternaam"],
  ["company_name", "Bedrijfsnaam"],
  ["phone", "Telefoonnummer"],
  ["business_address", "Bedrijfsadres"],
  ["kvk_number", "KvK-nummer"],
  ["vat_number", "BTW-nummer"],
];

interface Props {
  user: SupabaseUser;
  onProfileChange?: (profile: ProfileData) => void;
}

const CustomerDetails = ({ user, onProfileChange }: Props) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({});
  const [original, setOriginal] = useState<ProfileData>({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      const p: ProfileData = data ?? {};
      setProfile(p);
      setOriginal(p);
      onProfileChange?.(p);
    };
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Uw gegevens konden niet worden opgeslagen.",
        variant: "destructive",
      });
      return;
    }
    setOriginal(profile);
    setEditing(false);
    onProfileChange?.(profile);
    toast({ title: "Gegevens opgeslagen" });
  };

  return (
    <Card className="app-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
        <CardTitle className="flex items-center gap-2.5 text-white">
          <span className="app-icon-tile h-9 w-9">
            <Building2 className="h-4 w-4" />
          </span>
          Uw gegevens
        </CardTitle>
        {editing ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setProfile(original);
                setEditing(false);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Annuleren
            </Button>
            <Button size="sm" className="app-btn-primary" onClick={save} disabled={saving}>
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Opslaan..." : "Opslaan"}
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Edit3 className="h-4 w-4 mr-1" />
            Bewerken
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="text-slate-400">E-mailadres</Label>
            <p className="text-sm text-slate-300 mt-1">{user.email}</p>
          </div>
          {FIELDS.map(([key, label]) => (
            <div key={key}>
              <Label className="text-slate-400">{label}</Label>
              {editing ? (
                <Input
                  value={profile[key] || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                  className="mt-1 bg-white/5 border-white/10 text-slate-100 rounded-xl"
                />
              ) : (
                <p className="text-sm text-slate-300 mt-1">{profile[key] || "Niet ingevuld"}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;
