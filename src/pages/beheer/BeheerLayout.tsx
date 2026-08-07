import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import {
  ClipboardList, Mail, Building2, FileText, Users, Shield,
  ChevronDown, Menu, X, ArrowLeft, ScrollText, Activity, MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AppGlow } from "@/components/ui/app-surface";

const MAIN_NAV = [
  { to: "/beheer", label: "Werklijst", icon: ClipboardList, end: true },
  { to: "/beheer/post", label: "Post", icon: Mail },
  { to: "/beheer/aanvragen", label: "Aanvragen", icon: Building2 },
  { to: "/beheer/contracten", label: "Contracten", icon: FileText },
  { to: "/beheer/klanten", label: "Klanten", icon: Users },
];

const SYSTEM_NAV = [
  { to: "/beheer/systeem/beveiliging", label: "Beveiliging", icon: Shield },
  { to: "/beheer/systeem/audit", label: "Audit", icon: ClipboardList },
  { to: "/beheer/systeem/logs", label: "Logs", icon: ScrollText },
  { to: "/beheer/systeem/monitoring", label: "Monitoring", icon: Activity },
  { to: "/beheer/systeem/berichten", label: "Berichten", icon: MessageSquare },
];

const linkClass = (active: boolean, admin = false) =>
  cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap w-full border",
    active
      ? admin
        ? "bg-amber-500/15 text-amber-200 border-amber-500/30"
        : "bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-blue-200 border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]"
      : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent"
  );

const BeheerLayout = () => {
  const { user, loading, initialized, isAdmin: contextIsAdmin } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [systemOpen, setSystemOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;
    if (!initialized || loading) return;
    if (!user) {
      setAllowed(false);
      return;
    }
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (!active) return;
      setAllowed(!error && !!data);
    });
    return () => {
      active = false;
    };
  }, [user, loading, initialized, contextIsAdmin]);

  if (!initialized || loading || (user && allowed === null)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-400">Beheeromgeving laden...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!allowed) return <Navigate to="/dashboard" replace />;

  const nav = (
    <div className="app-card p-3 space-y-4">
      <div>
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Beheer</p>
        <nav className="flex flex-col gap-1">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => linkClass(isActive)}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-3 border-t border-white/10">
        <button
          onClick={() => setSystemOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
        >
          <span className="flex items-center gap-2"><Shield className="h-3 w-3" /> Systeem</span>
          <ChevronDown className={cn("h-3 w-3 transition-transform", systemOpen && "rotate-180")} />
        </button>
        {systemOpen && (
          <nav className="flex flex-col gap-1 mt-1">
            {SYSTEM_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => linkClass(isActive, true)}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div className="pt-3 border-t border-white/10">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Naar klantportaal</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="dashboard-dark relative min-h-screen bg-slate-950 overflow-hidden">
      <AppGlow />
      <div className="relative container mx-auto py-10 px-4 lg:px-6">
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-slate-200 text-sm"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Beheermenu
          </button>
          {mobileOpen && <div className="mt-3">{nav}</div>}
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-10">{nav}</div>
          </aside>
          <main className="flex-1 min-w-0 pb-12">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>

  );
};

export default BeheerLayout;
