
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

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
}

const ContractTemplateEditor: React.FC<ContractTemplateEditorProps> = ({ 
  templateId, 
  onBack 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
      let templateData = template;
      
      if (templateId) {
        // Update existing template
        const { data, error } = await supabase
          .from('contract_templates')
          .update(template)
          .eq('id', templateId)
          .select()
          .single();
        
        if (error) throw error;
        templateData = data;
      } else {
        // Create new template
        const { data, error } = await supabase
          .from('contract_templates')
          .insert(template)
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
      onBack();
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

  const fieldTypes = [
    { value: 'text', label: 'Tekst' },
    { value: 'textarea', label: 'Tekstvak' },
    { value: 'number', label: 'Nummer' },
    { value: 'date', label: 'Datum' },
    { value: 'email', label: 'E-mail' },
    { value: 'phone', label: 'Telefoon' },
    { value: 'select', label: 'Selectie' },
    { value: 'checkbox', label: 'Checkbox' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Terug naar sjablonen
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Sjabloon informatie</CardTitle>
            <CardDescription>
              Basis informatie over het contractsjabloon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={template.title}
                onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                placeholder="Voer een titel in"
              />
            </div>

            <div>
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                placeholder="Optionele beschrijving"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={template.status}
                onValueChange={(value) => setTemplate({ ...template, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Concept</SelectItem>
                  <SelectItem value="active">Actief</SelectItem>
                  <SelectItem value="inactive">Inactief</SelectItem>
                  <SelectItem value="archived">Gearchiveerd</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Contract inhoud</Label>
              <Textarea
                id="content"
                value={template.content}
                onChange={(e) => setTemplate({ ...template, content: e.target.value })}
                placeholder="Voer de contract inhoud in. Gebruik {{field_name}} voor variabele velden."
                rows={8}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Gebruik dubbele accolades zoals {{"{{"}}field_name{{"}}"}} om variabele velden in te voegen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Template Fields */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invulvelden</CardTitle>
                <CardDescription>
                  Definieer de velden die klanten moeten invullen
                </CardDescription>
              </div>
              <Button onClick={addField} size="sm" className="flex items-center gap-2">
                <Plus className="h-3 w-3" />
                Veld toevoegen
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nog geen velden toegevoegd.</p>
                  <p className="text-sm">Klik op "Veld toevoegen" om te beginnen.</p>
                </div>
              ) : (
                fields.map((field, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Veld {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Veldnaam</Label>
                        <Input
                          value={field.field_name}
                          onChange={(e) => updateField(index, { field_name: e.target.value })}
                          placeholder="field_name"
                        />
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={field.field_label}
                          onChange={(e) => updateField(index, { field_label: e.target.value })}
                          placeholder="Veld Label"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={field.field_type}
                          onValueChange={(value) => updateField(index, { field_type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${index}`}
                          checked={field.is_required}
                          onCheckedChange={(checked) => updateField(index, { is_required: !!checked })}
                        />
                        <Label htmlFor={`required-${index}`}>Verplicht</Label>
                      </div>
                    </div>

                    <div>
                      <Label>Placeholder</Label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        placeholder="Optionele placeholder tekst"
                      />
                    </div>

                    {field.field_type === 'select' && (
                      <div>
                        <Label>Opties (één per regel)</Label>
                        <Textarea
                          value={field.field_options?.join('\n') || ''}
                          onChange={(e) => updateField(index, { 
                            field_options: e.target.value.split('\n').filter(option => option.trim()) 
                          })}
                          placeholder="Optie 1&#10;Optie 2&#10;Optie 3"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => saveMutation.mutate()} 
          disabled={saveMutation.isPending}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saveMutation.isPending ? 'Bezig met opslaan...' : 'Sjabloon opslaan'}
        </Button>
      </div>
    </div>
  );
};

export default ContractTemplateEditor;
