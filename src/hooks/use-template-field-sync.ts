
import { useEffect } from "react";
import { extractPlaceholdersFromTemplate, mergeExtractedFieldsWithExisting } from "@/utils/template-placeholder-extractor";

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

interface UseTemplateFieldSyncProps {
  template: ContractTemplate;
  fields: TemplateField[];
  setFields: (fields: TemplateField[]) => void;
  autoSync?: boolean;
}

export const useTemplateFieldSync = ({
  template,
  fields,
  setFields,
  autoSync = true
}: UseTemplateFieldSyncProps) => {
  
  useEffect(() => {
    if (!autoSync || !template.content) return;
    
    // Extract placeholders from template content
    const extractedFields = extractPlaceholdersFromTemplate(template.content);
    
    // Merge with existing fields (don't overwrite existing ones)
    const mergedFields = mergeExtractedFieldsWithExisting(extractedFields, fields);
    
    // Only update if there are new fields
    if (mergedFields.length !== fields.length) {
      console.log('Auto-syncing template fields:', {
        extracted: extractedFields.length,
        existing: fields.length,
        merged: mergedFields.length
      });
      setFields(mergedFields);
    }
  }, [template.content, autoSync]);

  const syncFieldsManually = () => {
    const extractedFields = extractPlaceholdersFromTemplate(template.content);
    const mergedFields = mergeExtractedFieldsWithExisting(extractedFields, fields);
    setFields(mergedFields);
    return extractedFields.length;
  };

  return {
    syncFieldsManually
  };
};
