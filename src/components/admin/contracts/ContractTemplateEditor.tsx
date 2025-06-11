
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Eye, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateBasicInfoForm from "./TemplateBasicInfoForm";
import TemplateFieldsList from "./TemplateFieldsList";
import ContractPreview from "./ContractPreview";
import ContractGenerationForm from "./ContractGenerationForm";

interface ContractTemplateEditorProps {
  templateId: string | null;
  onBack: () => void;
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

interface ContractTemplate {
  id?: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  created_by?: string;
}

const ContractTemplateEditor: React.FC<ContractTemplateEditorProps> = ({ 
  templateId, 
  onBack 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  
  const [template, setTemplate] = useState<ContractTemplate>({
    title: '',
    description: '',
    content: '',
    status: 'draft'
  });
  
  const [fields, setFields] = useState<TemplateField[]>([]);

  // Load existing template if editing
  const { data: existingTemplate } = useQuery({
    queryKey: ['contract-template', templateId],
    queryFn: async () => {
      if (!templateId) return null;
      
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!templateId
  });

  const { data: existingFields } = useQuery({
    queryKey: ['contract-template-fields', templateId],
    queryFn: async () => {
      if (!templateId) return [];
      
      const { data, error } = await supabase
        .from('contract_template_fields')
        .select('*')
        .eq('template_id', templateId)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    },
    enabled: !!templateId
  });

  useEffect(() => {
    if (existingTemplate) {
      setTemplate(existingTemplate);
    }
  }, [existingTemplate]);

  useEffect(() => {
    if (existingFields) {
      setFields(existingFields);
    }
  }, [existingFields]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      let templateData = template;
      
      if (templateId) {
        // Update existing template
        const { data, error } = await supabase
          .from('contract_templates')
          .update({
            title: template.title,
            description: template.description,
            content: template.content,
            status: template.status
          })
          .eq('id', templateId)
          .select()
          .single();
        
        if (error) throw error;
        templateData = data;
      } else {
        // Create new template
        const { data, error } = await supabase
          .from('contract_templates')
          .insert({
            title: template.title,
            description: template.description,
            content: template.content,
            status: template.status,
            created_by: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        templateData = data;
      }

      // Save fields
      if (templateData.id) {
        // Delete existing fields
        await supabase
          .from('contract_template_fields')
          .delete()
          .eq('template_id', templateData.id);

        // Insert new fields
        if (fields.length > 0) {
          const fieldsToInsert = fields.map((field, index) => ({
            ...field,
            template_id: templateData.id,
            sort_order: index
          }));

          const { error: fieldsError } = await supabase
            .from('contract_template_fields')
            .insert(fieldsToInsert);

          if (fieldsError) throw fieldsError;
        }
      }

      return templateData;
    },
    onSuccess: () => {
      toast({
        title: "Sjabloon opgeslagen",
        description: "Het contractsjabloon is succesvol opgeslagen.",
      });
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const addField = () => {
    const newField: TemplateField = {
      field_name: `field_${fields.length + 1}`,
      field_label: 'Nieuw veld',
      field_type: 'text',
      is_required: false,
      placeholder: '',
      sort_order: fields.length
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<TemplateField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleGenerationComplete = () => {
    setActiveTab("basic");
    toast({
      title: "Contract verzonden",
      description: "Het contract is succesvol naar de klant verzonden.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Terug naar sjablonen
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => saveMutation.mutate()} 
            disabled={saveMutation.isPending}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Bezig met opslaan...' : 'Opslaan'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basis Info</TabsTrigger>
          <TabsTrigger value="fields">Velden</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="generate" disabled={!templateId}>
            <Send className="h-4 w-4 mr-1" />
            Genereren
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <TemplateBasicInfoForm 
            template={template}
            onTemplateChange={setTemplate}
          />
        </TabsContent>

        <TabsContent value="fields" className="mt-6">
          <TemplateFieldsList
            fields={fields}
            onAddField={addField}
            onUpdateField={updateField}
            onRemoveField={removeField}
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
              onGenerated={handleGenerationComplete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractTemplateEditor;
