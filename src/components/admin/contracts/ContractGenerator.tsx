import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Zap, FileText, Users, ArrowRight, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ContractGenerationForm from "./ContractGenerationForm";

interface ContractTemplate {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  created_at: string;
  _count?: {
    filled_contracts: number;
  };
}

interface TemplateField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'phone' | 'select' | 'checkbox';
  field_options?: string[];
  is_required: boolean;
  placeholder?: string;
  sort_order: number;
}

const ContractGenerator = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [showGenerationForm, setShowGenerationForm] = useState(false);

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['active-contract-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_templates')
        .select(`
          *,
          filled_contracts(count)
        `)
        .eq('status', 'active')
        .order('title');
      
      if (error) throw error;
      
      return data.map(template => ({
        ...template,
        _count: {
          filled_contracts: template.filled_contracts?.length || 0
        }
      })) as ContractTemplate[];
    }
  });

  const { data: templateFields, isLoading: fieldsLoading } = useQuery({
    queryKey: ['template-fields', selectedTemplateId],
    queryFn: async () => {
      if (!selectedTemplateId) return [];
      
      const { data, error } = await supabase
        .from('contract_template_fields')
        .select('*')
        .eq('template_id', selectedTemplateId)
        .order('sort_order');
      
      if (error) throw error;
      return data as TemplateField[];
    },
    enabled: !!selectedTemplateId
  });

  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowGenerationForm(false);
  };

  const handleStartGeneration = () => {
    setShowGenerationForm(true);
  };

  const handleGenerationComplete = () => {
    setShowGenerationForm(false);
    setSelectedTemplateId('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'draft': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  if (templatesLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showGenerationForm && selectedTemplate && templateFields) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Contract Generator - {selectedTemplate.title}
            </CardTitle>
            <CardDescription>
              Genereer een nieuw contract op basis van het geselecteerde sjabloon
            </CardDescription>
          </CardHeader>
        </Card>
        
        <ContractGenerationForm
          templateId={selectedTemplate.id}
          templateTitle={selectedTemplate.title}
          fields={templateFields}
          onGenerated={handleGenerationComplete}
        />
        
        <div className="flex justify-start">
          <Button 
            variant="outline" 
            onClick={() => setShowGenerationForm(false)}
          >
            Terug naar sjabloon selectie
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Contract Generator
          </CardTitle>
          <CardDescription>
            Genereer snel nieuwe contracten op basis van actieve sjablonen
          </CardDescription>
        </CardHeader>
      </Card>

      {!templates || templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Geen actieve sjablonen</h3>
              <p className="text-muted-foreground">
                Er zijn nog geen actieve contractsjablonen beschikbaar. Maak eerst een sjabloon aan en zet deze op 'actief' om contracten te kunnen genereren.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stap 1: Selecteer een sjabloon</CardTitle>
              <CardDescription>
                Kies het contractsjabloon dat je wilt gebruiken
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een contractsjabloon..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(template.status)}
                          <span>{template.title}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {template._count?.filled_contracts || 0} gebruik
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedTemplate && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium">{selectedTemplate.title}</h4>
                        {selectedTemplate.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedTemplate.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {selectedTemplate._count?.filled_contracts || 0} contracten gegenereerd
                          </span>
                          <span className="flex items-center gap-1">
                            {templateFields && (
                              <>
                                <FileText className="h-3 w-3" />
                                {templateFields.length} velden
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generation Step */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stap 2: Genereer contract</CardTitle>
                <CardDescription>
                  Start het proces om een nieuw contract te maken
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fieldsLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : templateFields && templateFields.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Dit sjabloon bevat {templateFields.length} velden die ingevuld kunnen worden:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {templateFields.slice(0, 6).map((field) => (
                          <div key={field.id} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>{field.field_label}</span>
                            {field.is_required && (
                              <Badge variant="outline" className="text-xs">verplicht</Badge>
                            )}
                          </div>
                        ))}
                        {templateFields.length > 6 && (
                          <div className="text-sm text-muted-foreground">
                            ... en {templateFields.length - 6} meer
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Dit sjabloon heeft geen configureerbare velden.
                    </p>
                  )}
                  
                  <Button 
                    onClick={handleStartGeneration}
                    className="w-full flex items-center gap-2"
                    size="lg"
                  >
                    <Zap className="h-4 w-4" />
                    Contract genereren
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ContractGenerator;