
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import AddressRequest from "./pages/AddressRequest";
import NotFound from "./pages/NotFound";
import CookiePolicy from "./pages/CookiePolicy";
import PublicContract from "./pages/PublicContract";
import CookieConsent from "@/components/CookieConsent";

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
      <Routes>
        <Route path="/" element={<AppLayout showSidebar={false}><Index /></AppLayout>} />
        <Route path="/auth" element={<AppLayout showSidebar={false}><Auth /></AppLayout>} />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AppLayout showSidebar={false}><Dashboard /></AppLayout>} />
        <Route path="/aanvragen" element={<AppLayout><AddressRequest /></AppLayout>} />
        <Route path="/contract/:accessToken" element={<AppLayout showSidebar={false}><PublicContract /></AppLayout>} />
        <Route path="/cookie-policy" element={<AppLayout showSidebar={false}><CookiePolicy /></AppLayout>} />
        <Route path="*" element={<AppLayout showSidebar={false}><NotFound /></AppLayout>} />
      </Routes>
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
