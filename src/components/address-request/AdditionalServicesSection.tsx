
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { additionalServicesOptions } from "./FormConstants";

interface AdditionalServicesSectionProps {
  selectedServices: string[];
  onServiceToggle: (service: string, checked: boolean) => void;
}

const AdditionalServicesSection = ({
  selectedServices,
  onServiceToggle
}: AdditionalServicesSectionProps) => {
  return (
    <div className="space-y-3">
      <Label>Extra diensten (optioneel)</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {additionalServicesOptions.map((service) => (
          <div key={service} className="flex items-center space-x-2">
            <Checkbox
              id={service}
              checked={selectedServices.includes(service)}
              onCheckedChange={(checked) => onServiceToggle(service, checked as boolean)}
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
  );
};

export default AdditionalServicesSection;
