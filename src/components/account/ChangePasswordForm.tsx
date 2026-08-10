import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const MIN_PASSWORD_LENGTH = 8;

interface ChangePasswordFormProps {
  /** Styling variant: dark (klantportaal kaart) of light (werkomgeving) */
  variant?: "dark" | "light";
  onSuccess?: () => void;
}

const ChangePasswordForm = ({ variant = "dark", onSuccess }: ChangePasswordFormProps) => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const inputClass =
    variant === "light"
      ? "mt-1"
      : "mt-1 bg-white/5 border-white/10 text-slate-100 rounded-xl";
  const labelClass = variant === "light" ? "text-slate-600" : "text-slate-400";

  const changePassword = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: "Wachtwoord te kort",
        description: `Gebruik minimaal ${MIN_PASSWORD_LENGTH} tekens.`,
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
    toast({ title: "Wachtwoord gewijzigd" });
    onSuccess?.();
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
      <div>
        <Label className={labelClass}>Nieuw wachtwoord</Label>
        <Input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <Label className={labelClass}>Herhaal wachtwoord</Label>
        <Input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
      </div>
      <p className={`sm:col-span-2 text-xs ${variant === "light" ? "text-slate-500" : "text-slate-400"}`}>
        Minimaal {MIN_PASSWORD_LENGTH} tekens. Bekende gelekte wachtwoorden worden geweigerd.
      </p>
      <div className="sm:col-span-2">
        <Button size="sm" className="app-btn-primary" onClick={changePassword} disabled={saving}>
          {saving ? "Opslaan..." : "Wachtwoord opslaan"}
        </Button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
