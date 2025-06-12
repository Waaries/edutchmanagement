import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TemplateBasicInfoForm from "./TemplateBasicInfoForm";
import TemplateFieldsList from "./TemplateFieldsList";
import EnhancedContractPreview from "./EnhancedContractPreview";
import ContractGenerationForm from "./ContractGenerationForm";
import DutchTemplateApplicator from "./DutchTemplateApplicator";

interface TemplateField {
  id?: string;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'phone' | 'select' | 'checkbox';
  field_options?: string[];
  is_required: boolean;
  placeholder?: string;
  sort_order: number;
}

interface ContractTemplate {
  id?: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  created_by?: string;
}

interface ContractTemplateEditorContentProps {
  template: ContractTemplate;
  fields: TemplateField[];
  templateId: string | null;
  onTemplateChange: (template: ContractTemplate) => void;
  onAddField: () => void;
  onUpdateField: (index: number, updates: Partial<TemplateField>) => void;
  onRemoveField: (index: number) => void;
  onGenerationComplete: () => void;
  onSyncFields?: () => number;
  onTemplateUpdated?: () => void;
}

const ContractTemplateEditorContent: React.FC<ContractTemplateEditorContentProps> = ({
  template,
  fields,
  templateId,
  onTemplateChange,
  onAddField,
  onUpdateField,
  onRemoveField,
  onGenerationComplete,
  onSyncFields,
  onTemplateUpdated
}) => {
  // Create enhanced sample data
  const createEnhancedSampleData = () => {
    const sampleData: Record<string, string> = {
      // Dutch business sample data
      bedrijfsnaam: 'Voorbeeld BV',
      kvk_nummer: '12345678',
      btw_nummer: 'NL123456789B01',
      contactpersoon: 'J. de Vries',
      email: 'contact@voorbeeldbv.nl',
      telefoon: '+31 20 123 4567',
      adres_type: 'Vestigingsadres',
      bedrijfsadres: 'Voorbeeldstraat 123\n1234AB Amsterdam',
      aanvullende_diensten: 'Postafhandeling en telefonische bereikbaarheid',
      maandelijkse_vergoeding: '€150,00',
      betalingstermijn: '30 dagen',
      eerste_betaling_datum: '01-02-2025',
      startdatum: '01-01-2025',
      einddatum: '31-12-2025',
      opzegtermijn: '1 maand',
      bijzondere_bepalingen: 'Geen bijzondere bepalingen',
      
      // Legacy field mapping
      client_name: 'Voorbeeld BV',
      client_email: 'contact@voorbeeldbv.nl',
      start_date: '01-01-2025',
      monthly_fee: '€150,00',
      datum: '01-01-2025',
      bedrag: '€150,00'
    };

    // Add sample data for custom fields
    fields.forEach(field => {
      if (!sampleData[field.field_name]) {
        switch (field.field_type) {
          case 'email':
            sampleData[field.field_name] = 'voorbeeld@email.nl';
            break;
          case 'date':
            sampleData[field.field_name] = '01-01-2025';
            break;
          case 'number':
            sampleData[field.field_name] = '1';
            break;
          case 'phone':
            sampleData[field.field_name] = '+31 6 12345678';
            break;
          case 'select':
            sampleData[field.field_name] = field.field_options?.[0] || 'Optie 1';
            break;
          case 'checkbox':
            sampleData[field.field_name] = 'Ja';
            break;
          default:
            sampleData[field.field_name] = field.placeholder || `Voorbeeld ${field.field_label}`;
        }
      }
    });

    return sampleData;
  };

  return (
    <>
      <TabsContent value="basic" className="mt-6">
        <TemplateBasicInfoForm 
          template={template}
          onTemplateChange={onTemplateChange}
        />
      </TabsContent>

      <TabsContent value="fields" className="mt-6">
        <TemplateFieldsList
          fields={fields}
          onAddField={onAddField}
          onUpdateField={onUpdateField}
          onRemoveField={onRemoveField}
          onSyncFields={onSyncFields}
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-6">
        <EnhancedContractPreview
          template={template}
          fields={fields}
          sampleData={createEnhancedSampleData()}
        />
      </TabsContent>

      <TabsContent value="apply-dutch" className="mt-6">
        {templateId && (
          <DutchTemplateApplicator
            templateId={templateId}
            templateTitle={template.title}
            onTemplateUpdated={onTemplateUpdated || (() => {})}
          />
        )}
      </TabsContent>

      <TabsContent value="generate" className="mt-6">
        {templateId && (
          <ContractGenerationForm
            templateId={templateId}
            templateTitle={template.title}
            fields={fields}
            onGenerated={onGenerationComplete}
          />
        )}
      </TabsContent>
    </>
  );
};

export default ContractTemplateEditorContent;
