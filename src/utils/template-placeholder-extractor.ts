interface ExtractedField {
  field_name: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'phone' | 'select' | 'checkbox';
  is_required: boolean;
  placeholder?: string;
  sort_order: number;
}

export const extractPlaceholdersFromTemplate = (content: string): ExtractedField[] => {
  console.log('Extracting placeholders from content:', content.substring(0, 200) + '...');
  
  // Extract all placeholders in the format {{placeholder_name}}
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  const matches = [...content.matchAll(placeholderRegex)];
  
  console.log('Found placeholder matches:', matches.map(m => m[1]));
  
  // Remove duplicates and create field objects
  const uniquePlaceholders = [...new Set(matches.map(match => match[1].trim()))];
  console.log('Unique placeholders:', uniquePlaceholders);
  
  return uniquePlaceholders.map((placeholder, index) => {
    const fieldName = placeholder.toLowerCase().replace(/\s+/g, '_');
    
    // Generate human-readable label
    const fieldLabel = placeholder
      .split(/[_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Determine field type based on field name patterns
    let fieldType: ExtractedField['field_type'] = 'text';
    let placeholderText = '';
    
    const lowerFieldName = fieldName.toLowerCase();
    
    if (lowerFieldName.includes('email') || lowerFieldName.includes('e_mail')) {
      fieldType = 'email';
      placeholderText = 'voorbeeld@bedrijf.nl';
    } else if (lowerFieldName.includes('phone') || lowerFieldName.includes('telefoon') || lowerFieldName.includes('tel')) {
      fieldType = 'phone';
      placeholderText = '+31 6 12345678';
    } else if (lowerFieldName.includes('date') || lowerFieldName.includes('datum') || lowerFieldName.includes('startdatum') || lowerFieldName.includes('einddatum')) {
      fieldType = 'date';
    } else if (lowerFieldName.includes('description') || lowerFieldName.includes('omschrijving') || lowerFieldName.includes('tekst') || lowerFieldName.includes('opmerking')) {
      fieldType = 'textarea';
      placeholderText = 'Voer hier een beschrijving in...';
    } else if (lowerFieldName.includes('amount') || lowerFieldName.includes('bedrag') || lowerFieldName.includes('prijs') || lowerFieldName.includes('kosten')) {
      fieldType = 'text';
      placeholderText = '€0,00';
    } else if (lowerFieldName.includes('aantal') || lowerFieldName.includes('number') || lowerFieldName.includes('nummer')) {
      fieldType = 'number';
      placeholderText = '1';
    } else if (lowerFieldName.includes('adres') || lowerFieldName.includes('address')) {
      fieldType = 'textarea';
      placeholderText = 'Straatnaam 123\n1234AB Plaatsnaam';
    } else if (lowerFieldName.includes('postcode') || lowerFieldName.includes('postal')) {
      fieldType = 'text';
      placeholderText = '1234AB';
    } else if (lowerFieldName.includes('kvk') || lowerFieldName.includes('chamberofcommerce')) {
      fieldType = 'text';
      placeholderText = '12345678';
    } else if (lowerFieldName.includes('btw') || lowerFieldName.includes('vat')) {
      fieldType = 'text';
      placeholderText = 'NL123456789B01';
    } else {
      placeholderText = `Voer ${fieldLabel.toLowerCase()} in`;
    }
    
    const extractedField = {
      field_name: fieldName,
      field_label: fieldLabel,
      field_type: fieldType,
      is_required: true, // Default to required
      placeholder: placeholderText,
      sort_order: index
    };
    
    console.log('Created field:', extractedField);
    return extractedField;
  });
};

export const mergeExtractedFieldsWithExisting = (
  extractedFields: ExtractedField[],
  existingFields: any[]
): ExtractedField[] => {
  console.log('Merging fields:', { extractedCount: extractedFields.length, existingCount: existingFields.length });
  
  const existingFieldNames = new Set(existingFields.map(field => field.field_name));
  console.log('Existing field names:', Array.from(existingFieldNames));
  
  // Keep existing fields and add new ones
  const mergedFields = [...existingFields];
  
  extractedFields.forEach(extractedField => {
    if (!existingFieldNames.has(extractedField.field_name)) {
      console.log('Adding new field:', extractedField.field_name);
      mergedFields.push({
        ...extractedField,
        sort_order: mergedFields.length
      });
    } else {
      console.log('Field already exists, skipping:', extractedField.field_name);
    }
  });
  
  console.log('Final merged fields count:', mergedFields.length);
  return mergedFields;
};
