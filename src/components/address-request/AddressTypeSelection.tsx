
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addressTypes } from "./FormConstants";

interface AddressTypeSelectionProps {
  selectedAddressType: string;
  onAddressTypeChange: (value: string) => void;
}

const AddressTypeSelection = ({
  selectedAddressType,
  onAddressTypeChange
}: AddressTypeSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="preferred_address_type">Gewenst pakket *</Label>
      <Select 
        value={selectedAddressType} 
        onValueChange={onAddressTypeChange}
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
  );
};

export default AddressTypeSelection;
