
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormState } from "@/hooks/use-contact-form";

interface ContactFormFieldsProps {
  formState: ContactFormState;
  errors: { [key: string]: string };
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFormFields = ({ formState, errors, loading, handleChange }: ContactFormFieldsProps) => {
  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Naam <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-2xl border transition-all ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
            }`}
            placeholder="Uw volledige naam"
            disabled={loading}
          />
          {errors.name && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            E-mail <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-2xl border transition-all ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
            }`}
            placeholder="uw@email.nl"
            disabled={loading}
          />
          {errors.email && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium">
          Telefoonnummer
        </label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formState.phone}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-2xl border transition-all ${
            errors.phone 
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
              : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
          }`}
          placeholder="Uw telefoonnummer"
          disabled={loading}
        />
        {errors.phone && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{errors.phone}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium">
          Uw Bericht <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 rounded-2xl border transition-all ${
            errors.message 
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
              : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
          }`}
          placeholder="Vertel ons wat meer over uw behoeften..."
          disabled={loading}
        />
        {errors.message && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{errors.message}</span>
          </div>
        )}
        <div className="text-right text-xs text-gray-500">
          {formState.message.length}/1000 karakters
        </div>
      </div>
    </div>
  );
};

export default ContactFormFields;
