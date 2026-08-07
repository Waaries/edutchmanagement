import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AccountSettings = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const changePassword = async () => {
    if (password.length < 8) {
      toast({
        title: "Wachtwoord te kort",
        description: "Gebruik minimaal 8 tekens.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({
        title: "Wachtwoorden komen niet overeen",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast({ title: "Wijzigen mislukt", description: error.message, variant: "destructive" });
      return;
    }
    setPassword("");
    setConfirm("");
    setOpen(false);
    toast({ title: "Wachtwoord gewijzigd" });
  };

  return (
    <Card className="bg-slate-900/40 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-400">Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
            <KeyRound className="h-4 w-4 mr-2" />
            Wachtwoord wijzigen
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-slate-400 hover:text-red-300"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Uitloggen
          </Button>
        </div>

        {open && (
          <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
            <div>
              <Label className="text-slate-400">Nieuw wachtwoord</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-slate-950/60 border-white/10 text-slate-100"
              />
            </div>
            <div>
              <Label className="text-slate-400">Herhaal wachtwoord</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 bg-slate-950/60 border-white/10 text-slate-100"
              />
            </div>
            <div className="sm:col-span-2">
              <Button size="sm" onClick={changePassword} disabled={saving}>
                {saving ? "Opslaan..." : "Wachtwoord opslaan"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
