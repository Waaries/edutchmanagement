import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { replacePlaceholders } from "@/utils/contract-placeholder-replacer";

interface FilledContract {
  id: string;
  template_id: string;
  client_email: string;
  client_name?: string;
  filled_data: Record<string, any>;
  status: string;
  access_token: string;
  contract_templates: {
    title: string;
    content: string;
    description?: string;
  };
}

interface TemplateField {
  field_name: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  placeholder?: string;
  field_options?: string[];
}

export default function PublicContract() {
  const { accessToken } = useParams<{ accessToken: string }>();
  const { toast } = useToast();
  const [contract, setContract] = useState<FilledContract | null>(null);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      fetchContract();
    }
  }, [accessToken]);

  const fetchContract = async () => {
    try {
      // Fetch contract with template
      const { data: contractData, error: contractError } = await supabase
        .from('filled_contracts')
        .select(`
          *,
          contract_templates (
            title,
            content,
            description
          )
        `)
        .eq('access_token', accessToken)
        .single();

      if (contractError) {
        setError('Contract not found or invalid access token');
        return;
      }

      setContract(contractData as FilledContract);
      setFormData((contractData.filled_data as Record<string, any>) || {});

      // Fetch template fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from('contract_template_fields')
        .select('*')
        .eq('template_id', contractData.template_id)
        .order('sort_order');

      if (!fieldsError && fieldsData) {
        setFields(fieldsData);
      }
    } catch (err) {
      setError('Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('filled_contracts')
        .update({
          filled_data: formData,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('access_token', accessToken);

      if (error) throw error;

      toast({
        title: "Contract Submitted",
        description: "Your contract has been successfully submitted.",
      });

      // Refresh contract data
      fetchContract();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const renderField = (field: TemplateField) => {
    const value = formData[field.field_name] || '';

    switch (field.field_type) {
      case 'textarea':
        return (
          <Textarea
            id={field.field_name}
            value={value}
            onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
            placeholder={field.placeholder}
            required={field.is_required}
          />
        );
      case 'select':
        return (
          <select
            id={field.field_name}
            value={value}
            onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
            required={field.is_required}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select an option</option>
            {field.field_options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.field_name}
              checked={value === true || value === 'true'}
              onChange={(e) => handleFieldChange(field.field_name, e.target.checked)}
              className="rounded border-input"
            />
            <Label htmlFor={field.field_name}>Yes</Label>
          </div>
        );
      default:
        return (
          <Input
            id={field.field_name}
            type={field.field_type}
            value={value}
            onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
            placeholder={field.placeholder}
            required={field.is_required}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Contract Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error || 'The contract could not be found. Please check your link and try again.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const processedContent = replacePlaceholders(
    contract.contract_templates.content,
    formData
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{contract.contract_templates.title}</CardTitle>
            {contract.contract_templates.description && (
              <p className="text-muted-foreground">
                {contract.contract_templates.description}
              </p>
            )}
          </CardHeader>
        </Card>

        {contract.status !== 'completed' && fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fill Contract Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.field_name} className="space-y-2">
                    <Label htmlFor={field.field_name}>
                      {field.field_label}
                      {field.is_required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {renderField(field)}
                  </div>
                ))}
                
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? <LoadingSpinner className="mr-2" /> : null}
                  Submit Contract
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Contract Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </CardContent>
        </Card>

        {contract.status === 'completed' && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-green-600">
                ✓ This contract has been completed and submitted.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}