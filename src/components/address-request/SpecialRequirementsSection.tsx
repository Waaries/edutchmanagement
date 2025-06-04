
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SpecialRequirementsSectionProps {
  specialRequirements: string;
  onSpecialRequirementsChange: (value: string) => void;
}

const SpecialRequirementsSection = ({
  specialRequirements,
  onSpecialRequirementsChange
}: SpecialRequirementsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="special_requirements">Bijzondere wensen of opmerkingen</Label>
      <Textarea
        id="special_requirements"
        value={specialRequirements}
        onChange={(e) => onSpecialRequirementsChange(e.target.value)}
        placeholder="Eventuele bijzondere wensen of specifieke eisen..."
        rows={4}
      />
    </div>
  );
};

export default SpecialRequirementsSection;
