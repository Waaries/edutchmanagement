import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, MapPin, Copy, Check } from "lucide-react";
import { updateMetaTags, pageSEO } from "@/lib/seo";
import { useToast } from "@/hooks/use-toast";

import CustomerMail from "@/components/dashboard/CustomerMail";
import CustomerDetails, { ProfileData } from "@/components/dashboard/CustomerDetails";
import AccountSettings from "@/components/dashboard/AccountSettings";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AppGlow } from "@/components/ui/app-surface";

const EDUTCH_ADDRESS = "Reigersbos 100 P, 1107 ES Amsterdam";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({});
  const [copied, setCopied] = useState(false);

  let authContext;
  try {
    authContext = useAuth();
  } catch (err) {
    console.error("Auth context error in Dashboard:", err);
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <p className="text-red-400 mb-4">Authenticatiefout opgetreden</p>
          <button
            onClick={() => (window.location.href = "/auth")}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90"
          >
            Terug naar inloggen
          </button>
        </div>
      </div>
    );
  }

  const { user, loading, isAdmin, initialized } = authContext;

  useEffect(() => {
    updateMetaTags(pageSEO.dashboard);
  }, []);

  if (!initialized || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-400">Bezig met laden...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const companyName =
    profile.company_name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    user.email?.split("@")[0] ||
    "klant";

  const fullAddress = profile.company_name
    ? `${profile.company_name}\n${EDUTCH_ADDRESS}`
    : EDUTCH_ADDRESS;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Adres gekopieerd" });
    } catch {
      toast({ title: "Kopiëren mislukt", variant: "destructive" });
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welkom,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {companyName}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Uw post en gegevens bij eDutch Management</p>
          </div>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/beheer")}
              className="text-slate-400 hover:text-blue-200 hover:bg-white/5"
            >
              <Shield className="h-4 w-4 mr-2" />
              Naar beheer
            </Button>
          )}
        </div>

        <Card className="bg-gradient-to-br from-blue-500/10 via-white/5 to-indigo-500/10 border-white/10 backdrop-blur-md">
          <CardContent className="p-5 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3 min-w-0">
              <MapPin className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                  Uw bedrijfsadres bij eDutch
                </p>
                <p className="text-slate-100 whitespace-pre-line break-words">{fullAddress}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={copyAddress}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Kopieer adres
            </Button>
          </CardContent>
        </Card>

        <CustomerMail />

        <CustomerDetails user={user} onProfileChange={setProfile} />

        <AccountSettings />
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
