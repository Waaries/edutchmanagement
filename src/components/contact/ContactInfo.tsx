
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ContactInfo = () => {
  return (
    <div className="h-full">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Contactinformatie</CardTitle>
          <CardDescription>
            U kunt ons ook rechtstreeks bereiken via onderstaande gegevens.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex-1">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">Ons Adres</h4>
              <p className="text-muted-foreground">
                Reigersbos 100 P<br />
                1107 ES Amsterdam
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">Telefoonnummer</h4>
              <p className="text-muted-foreground">+31 (0)20 737 03 85</p>
              <p className="text-sm text-muted-foreground/70">Ma-Vr: 09:00 - 17:00</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">E-mail</h4>
              <p className="text-muted-foreground">info@edutchmanagement.nl</p>
              <p className="text-sm text-muted-foreground/70">Antwoord binnen 24 uur</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">Openingstijden</h4>
                <div className="text-sm text-muted-foreground mt-1">
                  <p>Maandag - Vrijdag: 09:00 - 17:00</p>
                  <p>Zaterdag: Gesloten</p>
                  <p>Zondag: Gesloten</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-primary">Snelle respons</h4>
                <p className="text-sm text-primary/80 mt-1">
                  We reageren binnen 24 uur op uw bericht. Voor urgente zaken kunt u bellen tijdens kantooruren.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ContactInfo;
