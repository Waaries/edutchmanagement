
import { MapPin, Phone, Mail } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-10 card-shadow flex flex-col justify-between stacked-card">
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-left">
          Contactgegevens
        </h3>
        
        <div className="space-y-8 mb-12">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4 text-left">
              <h4 className="font-semibold text-lg mb-1">Ons Adres</h4>
              <p className="text-slate-600">
                Reigersbos 100 P<br />
                1107 ES Amsterdam
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4 text-left">
              <h4 className="font-semibold text-lg mb-1">Telefoonnummer</h4>
              <p className="text-slate-600">+31 (0)20 737 03 85</p>
              <p className="text-sm text-slate-500">Ma-Vr: 09:00 - 17:00</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4 text-left">
              <h4 className="font-semibold text-lg mb-1">E-mail</h4>
              <p className="text-slate-600">info@edutchmanagement.nl</p>
              <p className="text-sm text-slate-500">Antwoord binnen 24 uur</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-2xl overflow-hidden h-64 relative">
        <div className="absolute inset-0 bg-gray-600 opacity-10"></div>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2438.4499798694825!2d4.979604376940437!3d52.30021574461772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c60be2375814c1%3A0x4e2e41c3de0fc814!2sReigersbos%20100%2C%201107%20ES%20Amsterdam!5e0!3m2!1sen!2snl!4v1697029838428!5m2!1sen!2snl" 
          width="100%" 
          height="100%" 
          className="border-0"
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location Map"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactInfo;
