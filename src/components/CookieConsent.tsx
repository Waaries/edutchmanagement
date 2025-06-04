
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

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-w-[90%] w-full rounded-xl border-none p-6 shadow-lg">
        <DialogHeader className="text-left pb-2">
          <DialogTitle className="font-['Poppins',sans-serif] text-xl font-semibold">
            {translate("cookieConsent.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 pt-1">
            {translate("cookieConsent.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3 text-left">
          <div className="flex items-start space-x-3 border-l-4 border-orange-500 pl-3 py-1">
            <div className="w-full">
              <h4 className="font-semibold text-sm">{translate("cookieConsent.essential.title")}</h4>
              <p className="text-xs text-gray-500">
                {translate("cookieConsent.essential.description")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-l-4 border-transparent pl-3 py-1">
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-sm">{translate("cookieConsent.analytics.title")}</h4>
              <p className="text-xs text-gray-500">
                {translate("cookieConsent.analytics.description")}
              </p>
            </div>
            <Checkbox id="analytics" className="h-5 w-5 rounded-sm border-gray-300" />
          </div>
          
          <div className="flex items-center justify-between border-l-4 border-transparent pl-3 py-1">
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-sm">{translate("cookieConsent.marketing.title")}</h4>
              <p className="text-xs text-gray-500">
                {translate("cookieConsent.marketing.description")}
              </p>
            </div>
            <Checkbox id="marketing" className="h-5 w-5 rounded-sm border-gray-300" />
          </div>
        </div>

        <div className="text-left text-xs text-gray-500 mt-2">
          {translate("cookieConsent.viewPolicy")} 
          <Link to="/cookie-policy" className="text-blue-600 hover:underline ml-1">
            {translate("footer.cookies")}
          </Link>
        </div>

        <DialogFooter className="flex-col sm:flex-row justify-between gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleAcceptEssential}
            className="w-full sm:w-auto px-6 py-2 h-auto text-sm rounded-full border border-gray-300 hover:bg-gray-50"
          >
            {translate("cookieConsent.acceptEssential")}
          </Button>
          <Button
            className="w-full sm:w-auto px-6 py-2 h-auto text-sm rounded-full bg-orange-500 hover:bg-orange-600"
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
