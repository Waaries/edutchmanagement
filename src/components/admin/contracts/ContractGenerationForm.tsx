
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Mail } from "lucide-react";
import { generateAccessToken } from "@/lib/utils";

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

interface ContractGenerationFormProps {
  templateId: string;
  templateTitle: string;
  fields: TemplateField[];
  onGenerated: () => void;
}

const ContractGenerationForm: React.FC<ContractGenerationFormProps> = ({
  templateId,
  templateTitle,
  fields,
  onGenerated
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clientInfo, setClientInfo] = useState({
    email: '',
    name: ''
  });
  const [formData, setFormData] = useState<Record<string, any>>({});

  const generateMutation = useMutation({
    mutationFn: async () => {
      const accessToken = generateAccessToken();
      
      const { data, error } = await supabase
        .from('filled_contracts')
        .insert({
          template_id: templateId,
          client_email: clientInfo.email,
          client_name: clientInfo.name,
          filled_data: formData,
          access_token: accessToken,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Contract gegenereerd",
        description: "Het contract is succesvol aangemaakt en naar de klant verzonden.",
      });
      queryClient.invalidateQueries({ queryKey: ['filled-contracts'] });
      onGenerated();
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij genereren",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const renderField = (field: TemplateField) => {
    const fieldId = `field-${field.field_name}`;
    
    switch (field.field_type) {
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={formData[field.field_name] || ''}
            onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
          />
        );
      
      case 'select':
        return (
          <Select
            value={formData[field.field_name] || ''}
            onValueChange={(value) => handleFieldChange(field.field_name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Selecteer een optie'} />
            </SelectTrigger>
            <SelectContent>
              {field.field_options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={formData[field.field_name] || false}
              onCheckedChange={(checked) => handleFieldChange(field.field_name, !!checked)}
            />
            <Label htmlFor={fieldId} className="text-sm font-normal">
              {field.placeholder || field.field_label}
            </Label>
          </div>
        );
      
      default:
        return (
          <Input
            id={fieldId}
            type={field.field_type}
            value={formData[field.field_name] || ''}
            onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const isFormValid = () => {
    if (!clientInfo.email || !clientInfo.name) return false;
    
    return fields
      .filter(field => field.is_required)
      .every(field => formData[field.field_name] && formData[field.field_name] !== '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Contract Genereren
        </CardTitle>
        <CardDescription>
          Genereer een nieuw contract op basis van "{templateTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client Information */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Klantgegevens
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client-name">Naam *</Label>
              <Input
                id="client-name"
                value={clientInfo.name}
                onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Naam van de klant"
              />
            </div>
            <div>
              <Label htmlFor="client-email">E-mail *</Label>
              <Input
                id="client-email"
                type="email"
                value={clientInfo.email}
                onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="E-mailadres van de klant"
              />
            </div>
          </div>
        </div>

        {/* Contract Fields */}
        {fields.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contract gegevens
            </h4>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={index}>
                  <Label htmlFor={`field-${field.field_name}`}>
                    {field.field_label}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={() => generateMutation.mutate()} 
            disabled={!isFormValid() || generateMutation.isPending}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {generateMutation.isPending ? 'Bezig met genereren...' : 'Contract genereren'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractGenerationForm;
