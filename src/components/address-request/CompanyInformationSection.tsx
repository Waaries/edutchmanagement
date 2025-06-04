
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyInformationSectionProps {
  companyName: string;
  contactPerson: string;
  onCompanyNameChange: (value: string) => void;
  onContactPersonChange: (value: string) => void;
}

const CompanyInformationSection = ({
  companyName,
  contactPerson,
  onCompanyNameChange,
  onContactPersonChange
}: CompanyInformationSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="company_name">Bedrijfsnaam *</Label>
        <Input
          id="company_name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          required
          placeholder="Uw bedrijfsnaam"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact_person">Contactpersoon *</Label>
        <Input
          id="contact_person"
          value={contactPerson}
          onChange={(e) => onContactPersonChange(e.target.value)}
          required
          placeholder="Naam contactpersoon"
        />
      </div>
    </div>
  );
};

export default CompanyInformationSection;
