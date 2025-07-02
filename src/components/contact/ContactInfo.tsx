
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Contactinformatie</CardTitle>
          <CardDescription>
            U kunt ons ook rechtstreeks bereiken via onderstaande gegevens.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">Openingstijden</h4>
                <div className="text-sm text-muted-foreground mt-1">
                  <p>Maandag - Vrijdag: 09:00 - 17:00</p>
                  <p>Zaterdag: 10:00 - 14:00</p>
                  <p>Zondag: Gesloten</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-primary">Snelle respons</h4>
                <p className="text-sm text-primary/80 mt-1">
                  We reageren binnen 24 uur op uw bericht. Voor urgente zaken kunt u bellen tijdens kantooruren.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-64 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2438.4499798694825!2d4.979604376940437!3d52.30021574461772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c60be2375814c1%3A0x4e2e41c3de0fc814!2sReigersbos%20100%2C%201107%20ES%20Amsterdam!5e0!3m2!1sen!2snl!4v1697029838428!5m2!1sen!2snl" 
              width="100%" 
              height="100%" 
              className="border-0"
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location Map"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;
