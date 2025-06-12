
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TemplateBasicInfoForm from "./TemplateBasicInfoForm";
import TemplateFieldsList from "./TemplateFieldsList";
import ContractPreview from "./ContractPreview";
import ContractGenerationForm from "./ContractGenerationForm";

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
  onSyncFields
}) => {
  // Create sample data based on extracted placeholders from template content
  const createSampleData = () => {
    const sampleData: Record<string, string> = {
      // Default sample values
      client_name: 'Voorbeeld BV',
      client_email: 'contact@voorbeeld.nl',
      start_date: '01-01-2025',
      monthly_fee: '€150,00',
      bedrijfsnaam: 'Voorbeeld BV',
      email: 'contact@voorbeeld.nl',
      datum: '01-01-2025',
      bedrag: '€150,00'
    };

    // Add sample data for each field
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
        <ContractPreview
          template={template}
          fields={fields}
          sampleData={createSampleData()}
        />
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
