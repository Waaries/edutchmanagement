
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAnalytics } from "@/hooks/use-analytics";
import { devLog } from "@/lib/logger";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const { translate } = useLanguage();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Add a small delay to ensure everything is loaded
    const checkConsent = () => {
      devLog('[Cookie Consent] Checking for existing consent...');
      const hasConsented = getCookie("cookieConsent");
      devLog('[Cookie Consent] Existing consent:', hasConsented);
      
      if (!hasConsented) {
        devLog('[Cookie Consent] No consent found, showing dialog');
        setOpen(true);
      } else {
        devLog('[Cookie Consent] Consent already exists:', hasConsented);
        // If user has already consented to all, check the checkboxes
        if (hasConsented === 'all') {
          setAnalyticsChecked(true);
          setMarketingChecked(true);
        }
      }
      setIsLoaded(true);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(checkConsent, 100);
    return () => clearTimeout(timer);
  }, []);

  // Force show dialog for testing (can be removed later)
  useEffect(() => {
    // Check if we're in debug mode or testing
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test-consent') === 'true') {
      devLog('[Cookie Consent] Test mode activated, forcing dialog to show');
      setOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    devLog('[Cookie Consent] User accepted all cookies');
    setConsentCookies('all');
    setOpen(false);
    // Track this consent event if analytics is permitted
    trackEvent('cookie_consent', { consent_type: 'all' });
    toast({
      title: translate("cookieConsent.toastTitle"),
      description: translate("cookieConsent.toastAllDesc")
    });
  };

  const handleAcceptEssential = () => {
    devLog('[Cookie Consent] User accepted essential cookies only');
    setConsentCookies('essential');
    setOpen(false);
    toast({
      title: translate("cookieConsent.toastTitle"),
      description: translate("cookieConsent.toastEssentialDesc")
    });
  };

  const handleAcceptSelected = () => {
    // If analytics is checked, we consider it as 'all' for now
    // In a more advanced implementation, we could have different levels of consent
    if (analyticsChecked || marketingChecked) {
      devLog('[Cookie Consent] User accepted selected cookies (all)');
      setConsentCookies('all');
      trackEvent('cookie_consent', { 
        consent_type: 'selected',
        analytics: analyticsChecked,
        marketing: marketingChecked 
      });
    } else {
      devLog('[Cookie Consent] User accepted selected cookies (essential only)');
      setConsentCookies('essential');
    }
    setOpen(false);
    toast({
      title: translate("cookieConsent.toastTitle"),
      description: translate("cookieConsent.toastCustomDesc") || "Your cookie preferences have been saved."
    });
  };

  // Don't render anything until we've checked for existing consent
  if (!isLoaded) {
    devLog('[Cookie Consent] Component not yet loaded');
    return null;
  }

  devLog('[Cookie Consent] Rendering dialog with open state:', open);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-w-[90%] w-full app-card p-6 text-white shadow-2xl shadow-blue-950/40 [&>button]:text-slate-400 [&>button]:hover:text-white">
        <DialogHeader className="text-left pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            {translate("cookieConsent.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400 pt-1">
            {translate("cookieConsent.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3 text-left">
          <div className="flex items-start space-x-3 border-l-4 border-blue-500 pl-3 py-1">
            <div className="w-full">
              <h4 className="font-semibold text-sm text-slate-200">{translate("cookieConsent.essential.title")}</h4>
              <p className="text-xs text-slate-400">
                {translate("cookieConsent.essential.description")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-l-4 border-transparent pl-3 py-1">
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-sm text-slate-200">{translate("cookieConsent.analytics.title")}</h4>
              <p className="text-xs text-slate-400">
                {translate("cookieConsent.analytics.description")}
              </p>
            </div>
            <Checkbox 
              id="analytics" 
              checked={analyticsChecked}
              onCheckedChange={(checked) => setAnalyticsChecked(checked === true)}
              className="h-5 w-5 rounded-sm border-white/30 bg-white/5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white" 
            />
          </div>
          
          <div className="flex items-center justify-between border-l-4 border-transparent pl-3 py-1">
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-sm text-slate-200">{translate("cookieConsent.marketing.title")}</h4>
              <p className="text-xs text-slate-400">
                {translate("cookieConsent.marketing.description")}
              </p>
            </div>
            <Checkbox 
              id="marketing"
              checked={marketingChecked}
              onCheckedChange={(checked) => setMarketingChecked(checked === true)} 
              className="h-5 w-5 rounded-sm border-white/30 bg-white/5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white" 
            />
          </div>
        </div>

        <div className="text-left text-xs text-slate-400 mt-2">
          {translate("cookieConsent.viewPolicy")} 
          <Link to="/cookie-policy" className="text-blue-400 hover:text-blue-300 hover:underline ml-1">
            {translate("footer.cookies")}
          </Link>
        </div>

        <DialogFooter className="flex-col sm:flex-row justify-between gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleAcceptEssential}
            className="w-full sm:w-auto px-6 py-2 h-auto text-sm rounded-full bg-transparent border border-white/10 text-slate-200 hover:bg-white/5 hover:text-white"
          >
            {translate("cookieConsent.acceptEssential")}
          </Button>
          {(analyticsChecked || marketingChecked) && (
            <Button
              variant="outline"
              className="w-full sm:w-auto px-6 py-2 h-auto text-sm rounded-full bg-transparent border border-white/10 text-slate-200 hover:bg-white/5 hover:text-white"
              onClick={handleAcceptSelected}
            >
              {translate("cookieConsent.acceptSelected") || "Accept Selected"}
            </Button>
          )}
          <Button
            className="w-full sm:w-auto px-6 py-2 h-auto text-sm rounded-full app-btn-primary"
            onClick={handleAcceptAll}
          >
            {translate("cookieConsent.acceptAll")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

};

export default CookieConsent;
