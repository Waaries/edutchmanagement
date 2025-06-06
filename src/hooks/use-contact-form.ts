
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useAnalytics } from "@/hooks/use-analytics";

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
      console.log("[ContactForm] Submitting form data:", formState);
      
      // Store the message in the database
      const { data, error: dbError } = await supabase
        .from('contact_messages')
        .insert([{
          name: formState.name,
          email: formState.email,
          phone: formState.phone || null,
          message: formState.message,
          status: 'unread'
        }])
        .select();

      if (dbError) {
        console.error("[ContactForm] Database error:", dbError);
        throw new Error("Fout bij opslaan bericht in database");
      }

      console.log("[ContactForm] Message stored in database successfully:", data);
      
      // Also send email notification
      const { data: emailData, error: functionError } = await supabase.functions.invoke('send-contact-email', {
        body: formState
      });
      
      console.log("[ContactForm] Email function response:", emailData);
      
      if (functionError) {
        console.error("[ContactForm] Email function error:", functionError);
        // Don't throw here - message is already stored in DB
        toast({
          title: "Bericht opgeslagen",
          description: "Uw bericht is opgeslagen, maar de e-mailnotificatie kon niet worden verzonden.",
        });
        trackFormSubmission('contact_form', true);
      } else if (!emailData?.success) {
        console.error("[ContactForm] Email function failed:", emailData);
        toast({
          title: "Bericht opgeslagen",
          description: "Uw bericht is opgeslagen, maar de e-mailnotificatie kon niet worden verzonden.",
        });
        trackFormSubmission('contact_form', true);
      }
      
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
