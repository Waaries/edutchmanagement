import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactInfo = () => {
  const { translate } = useLanguage();
  const addressLines = translate("contact.info.addressValue").split("\n");

  return (
    <ul className="space-y-3">
      <li className="flex items-start group hover:bg-white/5 p-1 rounded-lg transition-all">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-base mb-0.5">{translate("contact.info.address")}</h4>
          <p className="text-slate-300 leading-tight text-base">
            {addressLines.map((line, i) => (
              <span key={i}>{line}{i < addressLines.length - 1 && <br />}</span>
            ))}
          </p>
        </div>
      </li>

      <li className="flex items-center group hover:bg-white/5 p-1 rounded-lg transition-all">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Phone className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-base mb-0.5">{translate("contact.info.phone")}</h4>
          <a href="tel:+31207370385" className="text-slate-300 hover:text-primary transition-colors text-base">
            {translate("contact.info.phoneValue")}
          </a>
        </div>
      </li>

      <li className="flex items-start group hover:bg-white/5 p-1 rounded-lg transition-all">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-base mb-0.5">{translate("contact.info.email")}</h4>
          <a href="mailto:info@edutchmanagement.nl" className="text-slate-300 hover:text-primary transition-colors text-base">
            {translate("contact.info.emailValue")}
          </a>
        </div>
      </li>

      <li className="flex items-center group hover:bg-white/5 p-1 rounded-lg transition-all">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-base mb-0.5">{translate("contact.info.hoursTitle")}</h4>
          <p className="text-slate-300 text-base">{translate("contact.info.hoursShort")}</p>
        </div>
      </li>
    </ul>
  );
};

export default ContactInfo;
