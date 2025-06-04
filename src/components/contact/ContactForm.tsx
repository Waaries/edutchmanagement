
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, AlertCircle, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useAutoSave } from "@/hooks/use-auto-save";
import FormProgress from "./FormProgress";

const ContactForm = () => {
  const { translate } = useLanguage();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // Form validation rules
  const validationRules = {
    name: { 
      required: true, 
      minLength: 2,
      maxLength: 50 
    },
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/
    },
    message: { 
      required: true, 
      minLength: 10,
      maxLength: 1000 
    }
  };

  const { errors, validateField, validateForm, clearError } = useFormValidation(validationRules);
  
  // Auto-save functionality
  const { loadSavedData, clearSavedData } = useAutoSave({
    data: formState,
    key: "contact_form",
    delay: 3000
  });

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadSavedData();
    if (savedData && Object.values(savedData).some(val => val !== "")) {
      setFormState(savedData);
      setLastSaved(new Date());
      toast({
        title: "Opgeslagen gegevens geladen",
        description: "Uw eerder ingevulde gegevens zijn automatisch hersteld.",
      });
    }
  }, []);

  // Calculate form progress
  const requiredFields = ['name', 'email', 'message'];
  const filledRequiredFields = requiredFields.filter(field => formState[field as keyof typeof formState].trim() !== '').length;
  const totalFields = Object.keys(formState).filter(key => formState[key as keyof typeof formState].trim() !== '').length;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    if (!error) {
      clearError(name);
    }
    
    setLastSaved(new Date());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formState)) {
      toast({
        title: "Formulier bevat fouten",
        description: "Controleer de aangegeven velden en probeer opnieuw.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Submitting form data:", formState);
      
      const { data, error: functionError } = await supabase.functions.invoke('send-contact-email', {
        body: formState
      });
      
      console.log("Form submission response:", data);
      
      if (functionError) {
        console.error("Supabase function error:", functionError);
        throw new Error(functionError.message || "Fout bij verzenden bericht");
      }
      
      if (!data?.success) {
        throw new Error((data?.message || data?.error || "Fout bij verzenden bericht"));
      }
      
      // Clear auto-saved data on successful submission
      clearSavedData();
      
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
          message: ""
        });
      }, 5000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      const errorMessage = err instanceof Error ? err.message : "Er is een onbekende fout opgetreden";
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-left">
          Stuur ons een bericht
        </h3>
        {lastSaved && (
          <div className="flex items-center text-sm text-green-600">
            <Save className="h-4 w-4 mr-1" />
            <span>Automatisch opgeslagen</span>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <FormProgress 
        currentStep={filledRequiredFields} 
        totalSteps={requiredFields.length}
        className="mb-6"
      />
      
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
