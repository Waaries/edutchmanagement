
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  const { translate } = useLanguage();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (error) setError(null);
  };
  
  const validateForm = () => {
    if (!formState.name.trim()) {
      setError("Vul a.u.b. uw naam in");
      return false;
    }
    
    if (!formState.email.trim() || !/^\S+@\S+\.\S+$/.test(formState.email)) {
      setError("Vul a.u.b. een geldig e-mailadres in");
      return false;
    }
    
    if (!formState.message.trim()) {
      setError("Vul a.u.b. een bericht in");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Submitting form data:", formState);
      
      // Send the contact form data to the Supabase edge function
      const { data, error: functionError } = await supabase.functions.invoke('send-contact-email', {
        body: formState
      });
      
      console.log("Form submission response:", data);
      
      if (functionError) {
        console.error("Supabase function error:", functionError);
        throw new Error(functionError.message || "Fout bij verzenden bericht");
      }
      
      if (!data.success) {
        throw new Error(data.message || data.error || "Fout bij verzenden bericht");
      }
      
      // Show success state
      setSubmitted(true);
      toast({
        title: "Bericht verzonden",
        description: "Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.",
      });
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormState({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: ""
        });
      }, 5000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      const errorMessage = err instanceof Error ? err.message : "Er is een onbekende fout opgetreden";
      setError(errorMessage);
      toast({
        title: "Fout bij verzenden",
        description: `Er is een fout opgetreden bij het verzenden van uw bericht: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stacked-card bg-white rounded-3xl p-8 md:p-10 card-shadow">
      <h3 className="text-2xl font-semibold mb-6 text-left">
        Stuur ons een bericht
      </h3>
      
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center mb-4 rounded-full">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="text-xl font-semibold mb-2">Bericht Verzonden!</h4>
          <p className="text-slate-600">
            Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Fout bij verzenden</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
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
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Uw volledige naam"
                disabled={loading}
              />
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
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="uw@email.nl"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Uw telefoonnummer"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="service" className="block text-sm font-medium">
                Gewenst Pakket
              </label>
              <select
                id="service"
                name="service"
                value={formState.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                disabled={loading}
              >
                <option value="">Selecteer een pakket</option>
                <option value="basic">Basis Bedrijfsadres</option>
                <option value="premium">Premium Bedrijfsadres</option>
                <option value="complete">Zakelijk Compleet</option>
                <option value="custom">Aangepast Pakket</option>
              </select>
            </div>
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
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Vertel ons wat meer over uw behoeften..."
              disabled={loading}
              required
            ></Textarea>
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-6"
            disabled={loading}
          >
            <span>{loading ? "Versturen..." : "Verstuur Bericht"}</span>
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
