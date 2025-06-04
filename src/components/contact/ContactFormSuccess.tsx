
import { Check } from "lucide-react";

const ContactFormSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-green-100 flex items-center justify-center mb-4 rounded-full">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h4 className="text-xl font-semibold mb-2">Bericht Verzonden!</h4>
      <p className="text-slate-600">
        Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.
      </p>
    </div>
  );
};

export default ContactFormSuccess;
