
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
}

const ContractTemplateEditorContent: React.FC<ContractTemplateEditorContentProps> = ({
  template,
  fields,
  templateId,
  onTemplateChange,
  onAddField,
  onUpdateField,
  onRemoveField,
  onGenerationComplete
}) => {
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
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-6">
        <ContractPreview
          template={template}
          fields={fields}
          sampleData={{
            client_name: 'Voorbeeld BV',
            client_email: 'contact@voorbeeld.nl',
            start_date: '01-01-2025',
            monthly_fee: '€150,00'
          }}
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
