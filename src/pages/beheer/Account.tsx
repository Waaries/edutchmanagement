import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "./PageHeader";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

const AccountPage = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase
      .from("profiles")
      .select("first_name, last_name, company_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data) return;
        setName(
          [data.first_name, data.last_name].filter(Boolean).join(" ") ||
            data.company_name ||
            ""
        );
      });
    return () => {
      active = false;
    };
  }, [user]);

  const rows: { label: string; value: string }[] = [
    { label: "Naam", value: name || "Niet ingevuld" },
    { label: "E-mailadres", value: user?.email ?? "-" },
    { label: "Rol", value: isAdmin ? "Beheerder" : "Gebruiker" },
    {
      label: "Account sinds",
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Mijn account"
        description="Je accountgegevens en wachtwoord"
        label="Account"
        icon={UserRound}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="app-card-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">Accountgegevens</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-slate-200">
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-slate-500">{row.label}</dt>
                  <dd className="text-slate-900 font-medium text-right break-all">{row.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="app-card-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">Wachtwoord wijzigen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ChangePasswordForm variant="light" />
            <div className="pt-4 border-t border-slate-200">
              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut()}
                className="text-slate-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
