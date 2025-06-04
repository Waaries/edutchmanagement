
import { Button } from "@/components/ui/button";
import { ArrowRight, Save } from "lucide-react";
import { useContactForm } from "@/hooks/use-contact-form";
import FormProgress from "./FormProgress";
import ContactFormFields from "./ContactFormFields";
import ContactFormSuccess from "./ContactFormSuccess";

const ContactForm = () => {
  const {
    formState,
    submitted,
    loading,
    lastSaved,
    errors,
    handleChange,
    handleSubmit,
    filledRequiredFields,
    requiredFields
  } = useContactForm();

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
        <ContactFormSuccess />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <ContactFormFields
            formState={formState}
            errors={errors}
            loading={loading}
            handleChange={handleChange}
          />
          
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
