
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Building2, Mail, Phone, User } from "lucide-react";

const AddressRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: user?.email || "",
    phone: "",
    preferred_address_type: "",
    business_type: "",
    expected_mail_volume: "",
    additional_services: [] as string[],
    special_requirements: ""
  });

  const addressTypes = [
    { value: "basic", label: "Basis Pakket - €29/maand", description: "Bedrijfsadres + postdoorverzendig" },
    { value: "premium", label: "Premium Pakket - €49/maand", description: "Basis + telefonservice + vergaderruimte" },
    { value: "complete", label: "Complete Pakket - €79/maand", description: "Premium + kantoorservice + secretariaatdiensten" }
  ];

  const businessTypes = [
    "Eenmanszaak",
    "BV",
    "NV",
    "VOF",
    "Maatschap",
    "Stichting",
    "Vereniging",
    "Anders"
  ];

  const mailVolumeOptions = [
    "Weinig (1-5 items per week)",
    "Gemiddeld (5-15 items per week)", 
    "Veel (15-30 items per week)",
    "Zeer veel (30+ items per week)"
  ];

  const additionalServicesOptions = [
    "Telefonische bereikbaarheid",
    "Vergaderruimte toegang",
    "Postscanning service",
    "Pakketservice",
    "Secretariaatdiensten",
    "Accountancy ondersteuning"
  ];

  const handleInputChange = (field: string, value: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar hoofdpagina
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bedrijfsadres Aanvragen
          </h1>
          <p className="text-lg text-gray-600">
            Vul onderstaand formulier in om uw bedrijfsadres aan te vragen
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Aanvraagformulier
            </CardTitle>
            <CardDescription>
              Alle velden met een * zijn verplicht
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Bedrijfsnaam *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    required
                    placeholder="Uw bedrijfsnaam"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contactpersoon *</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => handleInputChange("contact_person", e.target.value)}
                    required
                    placeholder="Naam contactpersoon"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mailadres *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      placeholder="uw@email.nl"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefoonnummer *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      placeholder="+31 6 12345678"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Address Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="preferred_address_type">Gewenst pakket *</Label>
                <Select 
                  value={formData.preferred_address_type} 
                  onValueChange={(value) => handleInputChange("preferred_address_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een pakket" />
                  </SelectTrigger>
                  <SelectContent>
                    {addressTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business_type">Type onderneming *</Label>
                  <Select 
                    value={formData.business_type} 
                    onValueChange={(value) => handleInputChange("business_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer type onderneming" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expected_mail_volume">Verwacht postvolume *</Label>
                  <Select 
                    value={formData.expected_mail_volume} 
                    onValueChange={(value) => handleInputChange("expected_mail_volume", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer postvolume" />
                    </SelectTrigger>
                    <SelectContent>
                      {mailVolumeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Services */}
              <div className="space-y-3">
                <Label>Extra diensten (optioneel)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {additionalServicesOptions.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.additional_services.includes(service)}
                        onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                      />
                      <Label 
                        htmlFor={service} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <Label htmlFor="special_requirements">Bijzondere wensen of opmerkingen</Label>
                <Textarea
                  id="special_requirements"
                  value={formData.special_requirements}
                  onChange={(e) => handleInputChange("special_requirements", e.target.value)}
                  placeholder="Eventuele bijzondere wensen of specifieke eisen..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? "Verzenden..." : "Aanvraag Indienen"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddressRequest;
