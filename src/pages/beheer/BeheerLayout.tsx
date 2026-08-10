import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import {
  ClipboardList, Mail, Building2, FileText, Users, Shield,
  ChevronDown, Menu, X, ArrowLeft, ScrollText, Activity, MessageSquare, UserRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import Logo from "@/components/Logo";

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
        ? "bg-brand/10 text-brand-strong border-brand/25"
        : "bg-blue-50 text-blue-700 border-blue-100"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent"
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

  if (false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-500">Beheeromgeving laden...</p>
      </div>
    );
  }

  if (false) return <Navigate to="/auth" replace />;
  if (false) return <Navigate to="/dashboard" replace />;

  const nav = (
    <div className="p-1 space-y-4">
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

      <div className="pt-3 border-t border-slate-200">
        <button
          onClick={() => setSystemOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800"
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

      <div className="pt-3 border-t border-slate-200">
        {user?.email && (
          <p className="px-3 pb-2 text-xs text-slate-500 truncate" title={user.email}>
            {user.email}
          </p>
        )}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Naar klantportaal</span>
        </Link>
        <NavLink
          to="/beheer/account"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) => linkClass(isActive)}
        >
          <UserRound className="h-4 w-4 shrink-0" />
          <span>Mijn account</span>
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Dark navigation anchor — counterpart of the public navbar */}
      <aside className="hidden lg:block w-72 shrink-0 relative bg-white border-r border-slate-200">
        <div className="relative sticky top-0 h-screen overflow-y-auto p-4">
          <Link to="/" className="block px-2 py-3 mb-2">
            <Logo variant="dark" className="h-10" />
          </Link>
          {nav}
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Dark topbar on small screens, holding the mobile menu */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/">
            <Logo variant="dark" className="h-9" />
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Beheermenu
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pb-4">{nav}</div>
        )}

        <main className="workspace-light flex-1 min-w-0 bg-slate-50 px-4 lg:px-8 py-8 lg:py-10 pb-16">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default BeheerLayout;
