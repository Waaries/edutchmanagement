
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useAnalytics } from "@/hooks/use-analytics";
import { getClientIP } from "@/lib/ip-utils";
import { devLog } from "@/lib/logger";

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const useContactForm = () => {
  const [formState, setFormState] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { trackFormSubmission } = useAnalytics();

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

  const { errors, validateField, validateForm, clearError } = useFormValidation<ContactFormState>(validationRules);
  
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
      trackFormSubmission('contact_form', false);
      return;
    }
    
    setLoading(true);
    
    try {
      devLog("[ContactForm] Submitting form data:", formState);
      
      // Get client IP for rate limiting
      const clientIP = await getClientIP();

      // Use secure contact submission function instead of direct database insert
      const { data: submitData, error: submitError } = await supabase.functions.invoke('secure-contact-submit', {
        body: {
          ...formState,
          ip_address: clientIP
        }
      });

      if (submitError) {
        console.error("[ContactForm] Secure submission error:", submitError);
        
        // Check if it's a rate limit error
        if (submitError.message?.includes('Rate limit exceeded')) {
          toast({
            title: "Te veel berichten verzonden",
            description: "U kunt maximaal 3 berichten per uur verzenden. Probeer het later opnieuw.",
            variant: "destructive",
          });
          trackFormSubmission('contact_form', false);
          return;
        }
        
        throw submitError;
      }

      if (!submitData?.success) {
        throw new Error(submitData?.error || "Onbekende fout bij verzenden");
      }

      devLog("[ContactForm] Secure submission successful:", submitData);
      
      // Clear auto-saved data on successful submission
      clearSavedData();
      
      setSubmitted(true);
      toast({
        title: "Bericht verzonden",
        description: "Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.",
      });
      
      // Track successful form submission
      trackFormSubmission('contact_form', true);
      
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
      console.error("[ContactForm] Error submitting form:", err);
      const errorMessage = err instanceof Error ? err.message : "Er is een onbekende fout opgetreden";
      toast({
        title: "Fout bij verzenden",
        description: `Er is een fout opgetreden bij het verzenden van uw bericht: ${errorMessage}`,
        variant: "destructive",
      });
      
      // Track failed form submission
      trackFormSubmission('contact_form', false);
    } finally {
      setLoading(false);
    }
  };

  // Calculate form progress
  const requiredFields = ['name', 'email', 'message'];
  const filledRequiredFields = requiredFields.filter(field => formState[field as keyof typeof formState].trim() !== '').length;

  return {
    formState,
    submitted,
    loading,
    lastSaved,
    errors,
    handleChange,
    handleSubmit,
    filledRequiredFields,
    requiredFields
  };
};
