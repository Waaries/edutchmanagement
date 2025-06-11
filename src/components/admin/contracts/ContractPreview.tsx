
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, Send } from "lucide-react";

interface ContractTemplate {
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
}

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

interface ContractPreviewProps {
  template: ContractTemplate;
  fields: TemplateField[];
  sampleData?: Record<string, any>;
}

const ContractPreview: React.FC<ContractPreviewProps> = ({ 
  template, 
  fields, 
  sampleData = {} 
}) => {
  const generatePreviewContent = () => {
    let content = template.content;
    
    // Replace field placeholders with sample data or field labels
    fields.forEach(field => {
      const placeholder = `{{${field.field_name}}}`;
      const replacement = sampleData[field.field_name] || `[${field.field_label}]`;
      content = content.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacement);
    });
    
    return content;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Contract Voorbeeld</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Preview van hoe het contract eruit zal zien
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-3 w-3 mr-1" />
              Volledig scherm
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-6 bg-white min-h-[400px]">
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold mb-4">{template.title}</h2>
            <div 
              className="whitespace-pre-wrap text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: generatePreviewContent().replace(/\n/g, '<br/>') }}
            />
          </div>
        </div>
        
        {fields.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Te invullen velden:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{field.field_label}</span>
                  {field.is_required && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractPreview;
