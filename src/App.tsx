
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTools from "./pages/AdminTools"; 
import NotFound from "./pages/NotFound";
import CookiePolicy from "./pages/CookiePolicy";
import CookieConsent from "@/components/CookieConsent";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <CookieConsent />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tools" element={<AdminTools />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
