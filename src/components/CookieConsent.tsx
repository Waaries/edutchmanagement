
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
import { getCookie, setConsentCookies } from "@/lib/cookie-utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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
      title: "Cookies geaccepteerd",
      description: "Al uw cookie voorkeuren zijn opgeslagen."
    });
  };

  const handleAcceptEssential = () => {
    setConsentCookies('essential');
    setOpen(false);
    toast({
      title: "Essentiële cookies geaccepteerd",
      description: "Alleen essentiële cookies worden gebruikt."
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-xl border-none p-8 shadow-lg">
        <DialogHeader className="text-left pb-2">
          <DialogTitle className="font-['Poppins',sans-serif] text-xl font-semibold">
            Cookie-instellingen
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 pt-1">
            Wij gebruiken cookies om uw ervaring op onze website te verbeteren.
            Deze cookies helpen ons te begrijpen hoe bezoekers onze site gebruiken.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3 text-left">
          <div className="flex items-start space-x-3 border-l-4 border-orange-500 pl-3 py-1">
            <div>
              <h4 className="font-semibold text-sm">Essentiële cookies</h4>
              <p className="text-xs text-gray-500 pr-4">
                Deze cookies zijn noodzakelijk voor het functioneren van de website. 
                Ze kunnen niet worden uitgeschakeld.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-l-4 border-transparent pl-3 py-1">
            <div>
              <h4 className="font-semibold text-sm">Analytische cookies</h4>
              <p className="text-xs text-gray-500 pr-4">
                Helpen ons te begrijpen hoe bezoekers omgaan met onze website.
                Deze informatie gebruiken wij om onze site te verbeteren.
              </p>
            </div>
            <Checkbox id="analytics" className="h-5 w-5 rounded-sm border-gray-300" />
          </div>
          
          <div className="flex items-center justify-between border-l-4 border-transparent pl-3 py-1">
            <div>
              <h4 className="font-semibold text-sm">Marketing cookies</h4>
              <p className="text-xs text-gray-500 pr-4">
                Worden gebruikt om bezoekers te volgen op verschillende websites.
                Het doel is advertenties te tonen die relevant en boeiend zijn voor de individuele gebruiker.
              </p>
            </div>
            <Checkbox id="marketing" className="h-5 w-5 rounded-sm border-gray-300" />
          </div>
        </div>

        <div className="text-left text-xs text-gray-500 mt-2">
          Bekijk ons <Link to="/cookie-policy" className="text-blue-600 hover:underline">cookiebeleid</Link> voor meer informatie.
        </div>

        <DialogFooter className="flex-col sm:flex-row justify-between gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleAcceptEssential}
            className="w-full sm:w-auto px-6 py-2 h-auto text-sm rounded-full border border-gray-300 hover:bg-gray-50"
          >
            Alleen essentiële cookies
          </Button>
          <Button
            className="w-full sm:w-auto px-6 py-2 h-auto text-sm rounded-full bg-orange-500 hover:bg-orange-600"
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
