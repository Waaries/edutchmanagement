
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAutoSave } from "@/hooks/use-auto-save";
import { trackFormSubmission } from "@/lib/analytics";
import { getClientIP } from "@/lib/ip-utils";

export interface AddressRequestFormData {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  preferred_address_type: string;
  business_type: string;
  expected_mail_volume: string;
  additional_services: string[];
  special_requirements: string;
}

export const useAddressRequestForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  
  const [formData, setFormData] = useState<AddressRequestFormData>({
    company_name: "",
    contact_person: "",
    email: user?.email || "",
    phone: "",
    preferred_address_type: "",
    business_type: "",
    expected_mail_volume: "",
    additional_services: [],
    special_requirements: ""
  });

  // Initialize auto-save functionality
  const { loadSavedData, clearSavedData } = useAutoSave({
    data: formData,
    key: "address_request_form",
    delay: 2000
  });

  // Load saved data on component mount (if available)
  useEffect(() => {
    if (!hasLoadedSavedData) {
      const savedData = loadSavedData();
      if (savedData && Object.keys(savedData).length > 0) {
        // Check if saved data has meaningful content (not just empty strings)
        const hasContent = Object.values(savedData).some(value => 
          Array.isArray(value) ? value.length > 0 : (typeof value === 'string' && value.trim() !== '')
        );
        
        if (hasContent) {
          setFormData(prev => ({
            ...prev,
            ...savedData,
            email: user?.email || savedData.email || "" // Prefer user email if logged in
          }));
          
          toast({
            title: "Opgeslagen gegevens geladen",
            description: "Uw eerder ingevulde gegevens zijn automatisch hersteld.",
          });
          
          // Clear the saved data immediately after loading to prevent it from loading again
          clearSavedData();
        }
      }
      setHasLoadedSavedData(true);
    }
  }, [user?.email, hasLoadedSavedData, toast]); // Removed loadSavedData and clearSavedData from dependencies

  const handleInputChange = (field: keyof AddressRequestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      additional_services: checked 
        ? [...prev.additional_services, service]
        : prev.additional_services.filter(s => s !== service)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Try to get client IP but don't block submission if it fails
      let clientIP = null;
      try {
        clientIP = await getClientIP();
      } catch (ipError) {
        console.warn("Failed to get client IP, continuing without it:", ipError);
        // Don't block form submission if IP fetch fails
      }

      const requestData = {
        ...formData,
        user_id: user?.id || null,
        ip_address: clientIP || null
      };



      const { data, error } = await supabase
        .from('address_requests')
        .insert([requestData])
        .select();

      if (error) {
        console.error("Supabase error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        trackFormSubmission('address_request', false);
        
        // Provide more specific error messages
        let userMessage = "Er is een fout opgetreden bij het verzenden van uw aanvraag.";
        if (error.code === "42501") {
          userMessage = "Autorisatiefout. Probeer het opnieuw of neem contact met ons op.";
        } else if (error.code === "23505") {
          userMessage = "Deze aanvraag is al eerder verzonden.";
        } else if (error.message?.includes("violates")) {
          userMessage = "Er is een validatiefout opgetreden. Controleer uw gegevens en probeer het opnieuw.";
        }
        
        toast({
          title: "Fout bij verzenden", 
          description: userMessage,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return; // Don't throw, handle gracefully
      }

      console.log("Successfully created address request:", data);

      // Send notification email to admin
      try {
        console.log("Sending notification email to admin...");
        const notificationResponse = await supabase.functions.invoke('send-address-request-notification', {
          body: requestData
        });

        if (notificationResponse.error) {
          console.error("Error sending notification email:", notificationResponse.error);
          // Don't fail the entire process if email fails, just log it
          toast({
            title: "Aanvraag verzonden",
            description: "Uw aanvraag is succesvol verzonden, maar er was een probleem met de e-mailnotificatie.",
          });
        } else {
          console.log("Notification email sent successfully");
        }
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't fail the entire process if email fails
      }

      // Track successful form submission
      trackFormSubmission('address_request', true);

      // Clear auto-saved data after successful submission
      clearSavedData();

      toast({
        title: "Aanvraag succesvol verzonden",
        description: user 
          ? "Uw aanvraag is succesvol verzonden. U kunt de status bekijken in uw dashboard."
          : "Uw aanvraag is succesvol verzonden. Wij nemen binnen 24 uur contact met u op via de opgegeven contactgegevens.",
      });

      // Redirect based on whether user is logged in
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      
      // Only show generic error if we haven't already shown a specific one
      let errorMessage = "Er is een onbekende fout opgetreden. Probeer het opnieuw.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        console.error("Detailed error:", error);
        // Don't show the raw error message to users for security
        errorMessage = "Er is een technische fout opgetreden. Neem contact met ons op als het probleem aanhoudt.";
      }
      
      toast({
        title: "Fout bij verzenden",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleServiceToggle,
    handleSubmit
  };
};
