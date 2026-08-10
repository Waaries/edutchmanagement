import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

const AccountSettings = () => {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Card className="app-card">
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

        {open && <ChangePasswordForm onSuccess={() => setOpen(false)} />}
      </CardContent>
    </Card>
  );
};

export default AccountSettings;

