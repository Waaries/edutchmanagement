import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Zap, FileText, Users, ArrowRight, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ContractGenerationForm from "./ContractGenerationForm";

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

const ContractGenerator = () => {
  const [showGenerationForm, setShowGenerationForm] = useState(false);

  // Get the single active contract
  const { data: contract, isLoading } = useQuery({
    queryKey: ['active-contract-template'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_templates')
        .select(`
          *,
          filled_contracts(count)
        `)
        .eq('status', 'active')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  // Get fields for the contract
  const { data: contractFields } = useQuery({
    queryKey: ['contract-fields', contract?.id],
    queryFn: async () => {
      if (!contract?.id) return [];
      
      const { data, error } = await supabase
        .from('contract_template_fields')
        .select('*')
        .eq('template_id', contract.id)
        .order('sort_order');
      
      if (error) throw error;
      return data as TemplateField[];
    },
    enabled: !!contract?.id
  });

  const handleStartGeneration = () => {
    if (!contract) return;
    setShowGenerationForm(true);
  };

  const handleGenerationComplete = () => {
    setShowGenerationForm(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Geen Contract Gevonden
          </CardTitle>
          <CardDescription>
            Er is geen actief contract beschikbaar. Ga naar de Contract Editor om een contract aan te maken.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (showGenerationForm && contractFields) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowGenerationForm(false)}
          className="mb-4"
        >
          ← Terug naar overzicht
        </Button>
        
        <ContractGenerationForm
          templateId={contract.id}
          templateTitle={contract.title}
          fields={contractFields}
          onGenerated={handleGenerationComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Contract Genereren</CardTitle>
                  <CardDescription>
                    Genereer een nieuw contract voor een klant
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={handleStartGeneration}
                className="flex items-center gap-2"
                disabled={!contractFields || contractFields.length === 0}
              >
                <ArrowRight className="h-4 w-4" />
                Contract Genereren
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{contract.title}</p>
                  <p className="text-sm text-muted-foreground">Contract Template</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{contract.filled_contracts?.[0]?.count || 0}</p>
                  <p className="text-sm text-muted-foreground">Gegenereerde contracten</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    <Clock className="h-3 w-3 mr-1" />
                    Klaar voor gebruik
                  </Badge>
                </div>
              </div>
            </div>

            {contract.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {contract.description}
              </p>
            )}

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">Contract Preview</h4>
              <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap">
                  {contract.content.substring(0, 200)}
                  {contract.content.length > 200 && '...'}
                </pre>
              </div>
            </div>

            {(!contractFields || contractFields.length === 0) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Geen velden geconfigureerd</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Er zijn nog geen velden ingesteld voor dit contract. Ga naar de Contract Editor om velden toe te voegen.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractGenerator;