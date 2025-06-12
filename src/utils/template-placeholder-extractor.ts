interface ExtractedField {
  field_name: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'phone' | 'select' | 'checkbox';
  is_required: boolean;
  placeholder?: string;
  sort_order: number;
}

export const extractPlaceholdersFromTemplate = (content: string): ExtractedField[] => {
  // Extract all placeholders in the format {{placeholder_name}}
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  const matches = [...content.matchAll(placeholderRegex)];
  
  // Remove duplicates and create field objects
  const uniquePlaceholders = [...new Set(matches.map(match => match[1].trim()))];
  
  return uniquePlaceholders.map((placeholder, index) => {
    const fieldName = placeholder.toLowerCase().replace(/\s+/g, '_');
    
    // Generate human-readable label
    const fieldLabel = placeholder
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Determine field type based on field name patterns
    let fieldType: ExtractedField['field_type'] = 'text';
    let placeholderText = '';
    
    if (fieldName.includes('email')) {
      fieldType = 'email';
      placeholderText = 'voorbeeld@bedrijf.nl';
    } else if (fieldName.includes('phone') || fieldName.includes('telefoon')) {
      fieldType = 'phone';
      placeholderText = '+31 6 12345678';
    } else if (fieldName.includes('date') || fieldName.includes('datum')) {
      fieldType = 'date';
    } else if (fieldName.includes('description') || fieldName.includes('omschrijving') || fieldName.includes('tekst')) {
      fieldType = 'textarea';
      placeholderText = 'Voer hier een beschrijving in...';
    } else if (fieldName.includes('amount') || fieldName.includes('bedrag') || fieldName.includes('prijs')) {
      fieldType = 'text';
      placeholderText = '€0,00';
    } else if (fieldName.includes('aantal') || fieldName.includes('number')) {
      fieldType = 'number';
      placeholderText = '1';
    } else {
      placeholderText = `Voer ${fieldLabel.toLowerCase()} in`;
    }
    
    return {
      field_name: fieldName,
      field_label: fieldLabel,
      field_type: fieldType,
      is_required: true, // Default to required
      placeholder: placeholderText,
      sort_order: index
    };
  });
};

export const mergeExtractedFieldsWithExisting = (
  extractedFields: ExtractedField[],
  existingFields: any[]
): ExtractedField[] => {
  const existingFieldNames = new Set(existingFields.map(field => field.field_name));
  
  // Keep existing fields and add new ones
  const mergedFields = [...existingFields];
  
  extractedFields.forEach(extractedField => {
    if (!existingFieldNames.has(extractedField.field_name)) {
      mergedFields.push({
        ...extractedField,
        sort_order: mergedFields.length
      });
    }
  });
  
  return mergedFields;
};
