
import { useEffect } from "react";
import { extractPlaceholdersFromTemplate, mergeExtractedFieldsWithExisting } from "@/utils/template-placeholder-extractor";
import { devLog } from "@/lib/logger";

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
    if (!autoSync || !template.content) {
      devLog('Skipping auto-sync:', { autoSync, hasContent: !!template.content });
      return;
    }
    
    devLog('Starting auto-sync for template content:', template.content.substring(0, 100) + '...');
    
    // Extract placeholders from template content
    const extractedFields = extractPlaceholdersFromTemplate(template.content);
    devLog('Extracted fields from template:', extractedFields);
    
    // Merge with existing fields (don't overwrite existing ones)
    const mergedFields = mergeExtractedFieldsWithExisting(extractedFields, fields);
    devLog('Merged fields result:', mergedFields);
    
    // Only update if there are new fields
    if (mergedFields.length !== fields.length) {
      devLog('Auto-syncing template fields:', {
        extracted: extractedFields.length,
        existing: fields.length,
        merged: mergedFields.length,
        newFields: mergedFields.length - fields.length
      });
      setFields(mergedFields);
    } else {
      devLog('No new fields detected, skipping update');
    }
  }, [template.content, autoSync, fields.length]);

  const syncFieldsManually = () => {
    devLog('Manual sync triggered for template:', template.title);
    
    if (!template.content) {
      devLog('No template content to sync');
      return 0;
    }
    
    const extractedFields = extractPlaceholdersFromTemplate(template.content);
    devLog('Manually extracted fields:', extractedFields);
    
    const mergedFields = mergeExtractedFieldsWithExisting(extractedFields, fields);
    devLog('Manual merge result:', mergedFields);
    
    const newFieldsCount = mergedFields.length - fields.length;
    devLog('New fields count:', newFieldsCount);
    
    setFields(mergedFields);
    return newFieldsCount;
  };

  return {
    syncFieldsManually
  };
};
