
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactInfo = () => {
  return (
    <ul className="space-y-5">
      <li className="flex items-start group hover:bg-white/5 p-1 rounded-lg transition-all">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-lg mb-1">Ons Adres</h4>
          <p className="text-slate-300 leading-tight text-lg">
            Reigersbos 100 P<br />
            1107 ES Amsterdam
          </p>
        </div>
      </li>
      
      <li className="flex items-center group hover:bg-white/5 p-1 rounded-lg transition-all">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Phone className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-lg mb-1">Telefoonnummer</h4>
          <a href="tel:+31207370385" className="text-slate-300 hover:text-primary transition-colors text-lg">
            +31 (0)20 737 03 85
          </a>
        </div>
      </li>
      
      <li className="flex items-start group hover:bg-white/5 p-1 rounded-lg transition-all">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-lg mb-1">E-mail</h4>
          <a href="mailto:info@edutchmanagement.nl" className="text-slate-300 hover:text-primary transition-colors text-lg">
            info@edutchmanagement.nl
          </a>
        </div>
      </li>
      
      <li className="flex items-center group hover:bg-white/5 p-1 rounded-lg transition-all">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-lg mb-1">Openingstijden</h4>
          <p className="text-slate-300 text-lg">Ma-Vr: 09:00 - 17:00</p>
        </div>
      </li>
    </ul>
  );
};

export default ContactInfo;
