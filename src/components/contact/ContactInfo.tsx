import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactInfo = () => {
  const { translate } = useLanguage();
  const addressLines = translate("contact.info.addressValue").split("\n");

  return (
    <div className="h-full">
      <Card className="h-full flex flex-col bg-slate-900/60 bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/10 backdrop-blur-sm shadow-2xl shadow-black/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-white">{translate("contact.info.title")}</CardTitle>
          <CardDescription className="text-slate-400">{translate("contact.info.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex-1">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1 text-white">{translate("contact.info.address")}</h4>
              <p className="text-slate-400">
                {addressLines.map((line, i) => (
                  <span key={i}>{line}{i < addressLines.length - 1 && <br />}</span>
                ))}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1 text-white">{translate("contact.info.phone")}</h4>
              <p className="text-slate-400">{translate("contact.info.phoneValue")}</p>
              <p className="text-sm text-slate-500">{translate("contact.info.hoursShort")}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1 text-white">{translate("contact.info.email")}</h4>
              <p className="text-slate-400">{translate("contact.info.emailValue")}</p>
              <p className="text-sm text-slate-500">{translate("contact.info.responseTime")}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <h4 className="font-medium text-white">{translate("contact.info.hoursTitle")}</h4>
                <div className="text-sm text-slate-400 mt-1">
                  <p>{translate("contact.info.hoursMonFri")}</p>
                  <p>{translate("contact.info.hoursSat")}</p>
                  <p>{translate("contact.info.hoursSun")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              <div>
                <h4 className="font-medium text-blue-300">{translate("contact.info.quickResponse")}</h4>
                <p className="text-sm text-slate-400 mt-1">{translate("contact.info.quickResponseDesc")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;
