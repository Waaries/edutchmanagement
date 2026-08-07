
import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useAnalytics } from "./hooks/use-analytics";
import { useMonitoring } from "./hooks/use-monitoring";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppLayout } from "./components/layout/AppLayout";
import { enforceHTTPS, applySecurityHeaders } from "./lib/security";
import { initializePerformanceMonitoring } from "./lib/performance";
import { updateMetaTags, pageSEO } from "./lib/seo";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CookieConsent from "@/components/CookieConsent";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Heavy routes are loaded on demand so the homepage bundle stays small.
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddressRequest = lazy(() => import("./pages/AddressRequest"));
const PublicContract = lazy(() => import("./pages/PublicContract"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));

const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const BeheerLayout = lazy(() => import("./pages/beheer/BeheerLayout"));
const Werklijst = lazy(() => import("./pages/beheer/Werklijst"));
const PostPage = lazy(() => import("./pages/beheer/pages").then((m) => ({ default: m.PostPage })));
const AanvragenPage = lazy(() => import("./pages/beheer/pages").then((m) => ({ default: m.AanvragenPage })));
const ContractenPage = lazy(() => import("./pages/beheer/pages").then((m) => ({ default: m.ContractenPage })));
const KlantenPage = lazy(() => import("./pages/beheer/Klanten"));
const KlantDetailPage = lazy(() => import("./pages/beheer/KlantDetail"));
const BeveiligingPage = lazy(() => import("./pages/beheer/pages").then((m) => ({ default: m.BeveiligingPage })));
const AuditPage = lazy(() => import("./pages/beheer/pages").then((m) => ({ default: m.AuditPage })));
const LogsPage = lazy(() => import("./pages/beheer/pages").then((m) => ({ default: m.LogsPage })));
const MonitoringPage = lazy(() => import("./pages/beheer/pages").then((m) => ({ default: m.MonitoringPage })));
const BerichtenPage = lazy(() => import("./pages/beheer/pages").then((m) => ({ default: m.BerichtenPage })));


const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <LoadingSpinner size="lg" />
  </div>
);

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  // Initialize analytics, monitoring, security, and performance
  useAnalytics();
  useMonitoring();

  // Initialize security and performance on mount
  useEffect(() => {
    enforceHTTPS();
    applySecurityHeaders();
    initializePerformanceMonitoring();
    updateMetaTags(pageSEO.home);
  }, []);

  return (
    <>
      <Toaster />
      <CookieConsent />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<AppLayout showSidebar={false}><Index /></AppLayout>} />
        <Route path="/auth" element={<AppLayout showSidebar={false}><Auth /></AppLayout>} />
        <Route path="/admin" element={<Navigate to="/beheer" replace />} />
        <Route path="/dashboard" element={<AppLayout showSidebar={false}><Dashboard /></AppLayout>} />
        <Route path="/beheer" element={<BeheerLayout />}>
          <Route index element={<Werklijst />} />
          <Route path="post" element={<PostPage />} />
          <Route path="aanvragen" element={<AanvragenPage />} />
          <Route path="contracten" element={<ContractenPage />} />
          <Route path="klanten" element={<KlantenPage />} />
          <Route path="klanten/:id" element={<KlantDetailPage />} />
          <Route path="systeem/beveiliging" element={<BeveiligingPage />} />
          <Route path="systeem/audit" element={<AuditPage />} />
          <Route path="systeem/logs" element={<LogsPage />} />
          <Route path="systeem/monitoring" element={<MonitoringPage />} />
          <Route path="systeem/berichten" element={<BerichtenPage />} />
        </Route>

        <Route path="/aanvragen" element={<AppLayout><AddressRequest /></AppLayout>} />
        <Route path="/contract/:accessToken" element={<AppLayout showSidebar={false}><PublicContract /></AppLayout>} />
        <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

        <Route path="/cookie-policy" element={<AppLayout showSidebar={false}><CookiePolicy /></AppLayout>} />
        <Route path="/privacy" element={<AppLayout showSidebar={false}><PrivacyPolicy /></AppLayout>} />
        <Route path="/terms" element={<AppLayout showSidebar={false}><TermsAndConditions /></AppLayout>} />
        <Route path="*" element={<AppLayout showSidebar={false}><NotFound /></AppLayout>} />
      </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <BrowserRouter>
            <LanguageProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </LanguageProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
