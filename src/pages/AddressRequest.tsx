
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Info, CheckCircle } from "lucide-react";
import { useAddressRequestForm } from "@/hooks/use-address-request-form";
import { useAuth } from "@/contexts/AuthContext";
import CompanyInformationSection from "@/components/address-request/CompanyInformationSection";
import ContactInformationSection from "@/components/address-request/ContactInformationSection";
import AddressTypeSelection from "@/components/address-request/AddressTypeSelection";
import BusinessInformationSection from "@/components/address-request/BusinessInformationSection";
import AdditionalServicesSection from "@/components/address-request/AdditionalServicesSection";
import SpecialRequirementsSection from "@/components/address-request/SpecialRequirementsSection";

const AddressRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleServiceToggle,
    handleSubmit
  } = useAddressRequestForm();

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

          {!user ? (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Aanvraag zonder account</p>
                <p>U kunt deze aanvraag indienen zonder een account aan te maken. Wij nemen contact met u op via de opgegeven contactgegevens.</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Ingelogd als {user.email}</p>
                <p>Uw aanvraag wordt gekoppeld aan uw account en u kunt de status volgen in uw dashboard.</p>
              </div>
            </div>
          )}
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
              <CompanyInformationSection
                companyName={formData.company_name}
                contactPerson={formData.contact_person}
                onCompanyNameChange={(value) => handleInputChange("company_name", value)}
                onContactPersonChange={(value) => handleInputChange("contact_person", value)}
              />

              <ContactInformationSection
                email={formData.email}
                phone={formData.phone}
                onEmailChange={(value) => handleInputChange("email", value)}
                onPhoneChange={(value) => handleInputChange("phone", value)}
              />

              <AddressTypeSelection
                selectedAddressType={formData.preferred_address_type}
                onAddressTypeChange={(value) => handleInputChange("preferred_address_type", value)}
              />

              <BusinessInformationSection
                businessType={formData.business_type}
                expectedMailVolume={formData.expected_mail_volume}
                onBusinessTypeChange={(value) => handleInputChange("business_type", value)}
                onMailVolumeChange={(value) => handleInputChange("expected_mail_volume", value)}
              />

              <AdditionalServicesSection
                selectedServices={formData.additional_services}
                onServiceToggle={handleServiceToggle}
              />

              <SpecialRequirementsSection
                specialRequirements={formData.special_requirements}
                onSpecialRequirementsChange={(value) => handleInputChange("special_requirements", value)}
              />

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
