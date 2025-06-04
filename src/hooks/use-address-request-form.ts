
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
    
    if (!user) {
      toast({
        title: "Inloggen vereist",
        description: "U moet ingelogd zijn om een aanvraag in te dienen.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('address_requests')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Aanvraag verzonden",
        description: "Uw aanvraag is succesvol verzonden. Wij nemen binnen 24 uur contact met u op.",
      });

      navigate("/dashboard");
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
