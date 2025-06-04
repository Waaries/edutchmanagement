
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { businessTypes, mailVolumeOptions } from "./FormConstants";

interface BusinessInformationSectionProps {
  businessType: string;
  expectedMailVolume: string;
  onBusinessTypeChange: (value: string) => void;
  onMailVolumeChange: (value: string) => void;
}

const BusinessInformationSection = ({
  businessType,
  expectedMailVolume,
  onBusinessTypeChange,
  onMailVolumeChange
}: BusinessInformationSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="business_type">Type onderneming *</Label>
        <Select 
          value={businessType} 
          onValueChange={onBusinessTypeChange}
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
          value={expectedMailVolume} 
          onValueChange={onMailVolumeChange}
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
  );
};

export default BusinessInformationSection;
