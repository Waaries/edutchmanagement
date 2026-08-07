import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Ontbrekende authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error: decisionError } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (decisionError) {
      setBusy(false);
      setError(decisionError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("De autorisatieserver gaf geen doorverwijzing terug.");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? "een applicatie";

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-slate-900">Autorisatie mislukt</h1>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
          </>
        ) : !details ? (
          <div className="flex flex-col items-center py-6">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-slate-600">Aanvraag laden...</p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-slate-900">
              {clientName} koppelen aan uw account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Hiermee kan {clientName} namens u gegevens uit eDutch Management lezen en bijwerken.
              U kunt de koppeling later intrekken.
            </p>
            <div className="mt-6 flex gap-3">
              <Button disabled={busy} onClick={() => decide(true)} className="flex-1">
                Goedkeuren
              </Button>
              <Button
                disabled={busy}
                variant="outline"
                onClick={() => decide(false)}
                className="flex-1"
              >
                Weigeren
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OAuthConsent;
