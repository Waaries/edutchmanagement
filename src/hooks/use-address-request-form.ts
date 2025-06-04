
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAutoSave } from "@/hooks/use-auto-save";

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
  useState(() => {
    const savedData = loadSavedData();
    if (savedData) {
      setFormData(prev => ({
        ...prev,
        ...savedData,
        email: user?.email || savedData.email || "" // Prefer user email if logged in
      }));
      
      toast({
        title: "Opgeslagen gegevens geladen",
        description: "Uw eerder ingevulde gegevens zijn automatisch hersteld.",
      });
    }
  });

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
      console.log("Submitting address request with data:", formData);
      console.log("User authenticated:", !!user);
      console.log("User ID:", user?.id || 'null');

      const requestData = {
        ...formData,
        user_id: user?.id || null // Explicitly set to null for anonymous users
      };

      console.log("Final request data:", requestData);

      const { data, error } = await supabase
        .from('address_requests')
        .insert([requestData])
        .select(); // Add select to get the inserted data back

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Successfully created address request:", data);

      // Clear auto-saved data after successful submission
      clearSavedData();

      toast({
        title: "Aanvraag verzonden",
        description: user 
          ? "Uw aanvraag is succesvol verzonden. U kunt de status bekijken in uw dashboard."
          : "Uw aanvraag is succesvol verzonden. Wij nemen binnen 24 uur contact met u op via de opgegeven contactgegevens.",
      });

      // Redirect based on whether user is logged in
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/"); // Redirect to homepage for anonymous users
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Fout bij verzenden",
        description: "Er is een fout opgetreden bij het verzenden van uw aanvraag. Probeer het opnieuw.",
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
