
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
    setOpen(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential");
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Montserrat',sans-serif] text-xl">Cookie-instellingen</DialogTitle>
          <DialogDescription>
            Wij gebruiken cookies om uw ervaring op onze website te verbeteren.
            Deze cookies helpen ons te begrijpen hoe bezoekers onze site gebruiken.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 mt-0.5 bg-[#F97316] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Essentiële cookies</h4>
              <p className="text-sm text-gray-500">
                Deze cookies zijn noodzakelijk voor het functioneren van de website.
                Ze kunnen niet worden uitgeschakeld.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 mt-0.5 border border-gray-300 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs"></span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Analytische cookies</h4>
              <p className="text-sm text-gray-500">
                Helpen ons te begrijpen hoe bezoekers omgaan met onze website.
                Deze informatie gebruiken wij om onze site te verbeteren.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 mt-0.5 border border-gray-300 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs"></span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Marketing cookies</h4>
              <p className="text-sm text-gray-500">
                Worden gebruikt om bezoekers te volgen op verschillende websites.
                Het doel is advertenties te tonen die relevant en boeiend zijn voor de individuele gebruiker.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={handleAcceptEssential}
            className="w-full sm:w-auto border-gray-300"
          >
            Alleen essentiële cookies
          </Button>
          <Button
            className="w-full sm:w-auto bg-[#F97316] hover:bg-[#F97316]/90"
            onClick={handleAcceptAll}
          >
            Alle cookies accepteren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookieConsent;
