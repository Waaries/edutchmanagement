
export const replacePlaceholders = (content: string, filledData: Record<string, any>): string => {
  let processedContent = content;
  
  // Replace all placeholders in the format {{placeholder_name}}
  Object.entries(filledData).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    processedContent = processedContent.replace(regex, value || '');
  });
  
  // Clean up any remaining unreplaced placeholders
  processedContent = processedContent.replace(/\{\{[^}]+\}\}/g, '[Not filled]');
  
  return processedContent;
};

export const formatContractForDisplay = (template: any, filledData: Record<string, any>) => {
  const processedContent = replacePlaceholders(template.content, filledData);
  
  return {
    ...template,
    content: processedContent
  };
};
