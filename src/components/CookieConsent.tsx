
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { getCookie, setConsentCookies } from "@/lib/cookie-utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Cookie, Shield, BarChart3, Target } from "lucide-react";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const { toast } = useToast();
  const { translate } = useLanguage();

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = getCookie("cookieConsent");
    if (!hasConsented) {
      setOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setConsentCookies('all');
    setOpen(false);
    toast({
      title: translate("cookieConsent.toastTitle"),
      description: translate("cookieConsent.toastAllDesc")
    });
  };

  const handleAcceptEssential = () => {
    setConsentCookies('essential');
    setOpen(false);
    toast({
      title: translate("cookieConsent.toastTitle"),
      description: translate("cookieConsent.toastEssentialDesc")
    });
  };

  const handleAcceptSelected = () => {
    const consentType = (analyticsConsent || marketingConsent) ? 'all' : 'essential';
    setConsentCookies(consentType);
    setOpen(false);
    toast({
      title: translate("cookieConsent.toastTitle"),
      description: translate("cookieConsent.toastAllDesc")
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl max-w-[95%] w-full rounded-2xl border-none p-0 shadow-2xl overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Cookie className="h-7 w-7" />
            </div>
            <DialogTitle className="font-['Space_Grotesk',sans-serif] text-2xl font-semibold">
              {translate("cookieConsent.title")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-blue-100 text-base leading-relaxed">
            {translate("cookieConsent.description")}
          </DialogDescription>
        </div>
        
        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          {/* Essential Cookies */}
          <div className="flex items-start justify-between p-6 bg-green-100 rounded-xl border-2 border-green-300">
            <div className="flex items-start gap-5">
              <div className="p-3 bg-green-200 rounded-full shrink-0">
                <Shield className="h-6 w-6 text-green-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-semibold text-green-900 text-base">
                    {translate("cookieConsent.essential.title")}
                  </h4>
                  <span className="text-sm bg-green-200 text-green-800 px-3 py-1 rounded-full font-medium">
                    {translate("cookieConsent.essential.required")}
                  </span>
                </div>
                <p className="text-sm text-green-800 leading-relaxed">
                  {translate("cookieConsent.essential.description")}
                </p>
              </div>
            </div>
            <div className="ml-6">
              <Switch checked={true} disabled className="data-[state=checked]:bg-green-600" />
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-start justify-between p-6 bg-slate-100 rounded-xl border-2 border-slate-300 hover:bg-slate-150 transition-colors">
            <div className="flex items-start gap-5">
              <div className="p-3 bg-slate-200 rounded-full shrink-0">
                <BarChart3 className="h-6 w-6 text-slate-700" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-base mb-3">
                  {translate("cookieConsent.analytics.title")}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {translate("cookieConsent.analytics.description")}
                </p>
              </div>
            </div>
            <div className="ml-6">
              <Switch 
                checked={analyticsConsent}
                onCheckedChange={setAnalyticsConsent}
                className="data-[state=checked]:bg-blue-600" 
              />
            </div>
          </div>
          
          {/* Marketing Cookies */}
          <div className="flex items-start justify-between p-6 bg-slate-100 rounded-xl border-2 border-slate-300 hover:bg-slate-150 transition-colors">
            <div className="flex items-start gap-5">
              <div className="p-3 bg-slate-200 rounded-full shrink-0">
                <Target className="h-6 w-6 text-slate-700" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-base mb-3">
                  {translate("cookieConsent.marketing.title")}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {translate("cookieConsent.marketing.description")}
                </p>
              </div>
            </div>
            <div className="ml-6">
              <Switch 
                checked={marketingConsent}
                onCheckedChange={setMarketingConsent}
                className="data-[state=checked]:bg-blue-600" 
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="text-center text-sm text-slate-600 mb-6">
            {translate("cookieConsent.viewPolicy")} 
            <Link to="/cookie-policy" className="text-blue-600 hover:text-blue-700 underline ml-1 font-medium">
              {translate("footer.cookies")}
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={handleAcceptEssential}
              className="flex-1 h-12 text-base font-medium rounded-xl border-2 border-slate-400 hover:bg-slate-100 transition-colors"
            >
              {translate("cookieConsent.acceptEssential")}
            </Button>
            <Button
              variant="outline"
              onClick={handleAcceptSelected}
              className="flex-1 h-12 text-base font-medium rounded-xl border-2 border-blue-400 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {translate("cookieConsent.acceptSelected")}
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="flex-1 h-12 text-base font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all"
            >
              {translate("cookieConsent.acceptAll")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieConsent;
