
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, RefreshCw, CheckCircle } from "lucide-react";
import { dutchAddressContractTemplate } from "@/utils/dutch-address-template";
import { extractPlaceholdersFromTemplate, mergeExtractedFieldsWithExisting } from "@/utils/template-placeholder-extractor";

interface DutchTemplateApplicatorProps {
  templateId: string;
  templateTitle: string;
  onTemplateUpdated: () => void;
}

const DutchTemplateApplicator: React.FC<DutchTemplateApplicatorProps> = ({
  templateId,
  templateTitle,
  onTemplateUpdated
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  const applyDutchTemplate = async () => {
    if (!user?.id) {
      toast({
        title: "Authenticatie vereist",
        description: "U moet ingelogd zijn om een sjabloon bij te werken.",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);

    try {
      // Step 1: Update the template with Dutch contract content
      const { error: templateError } = await supabase
        .from('contract_templates')
        .update({
          title: dutchAddressContractTemplate.title,
          description: dutchAddressContractTemplate.description,
          content: dutchAddressContractTemplate.content,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', templateId);

      if (templateError) throw templateError;

      // Step 2: Extract placeholders from the new content
      const extractedFields = extractPlaceholdersFromTemplate(dutchAddressContractTemplate.content);
      
      // Step 3: Get existing fields to merge
      const { data: existingFields, error: fieldsError } = await supabase
        .from('contract_template_fields')
        .select('*')
        .eq('template_id', templateId)
        .order('sort_order');

      if (fieldsError) throw fieldsError;

      // Step 4: Define the complete Dutch template fields
      const dutchTemplateFields = [
        {
          template_id: templateId,
          field_name: 'bedrijfsnaam',
          field_label: 'Bedrijfsnaam',
          field_type: 'text' as const,
          is_required: true,
          placeholder: 'Naam van het bedrijf',
          sort_order: 0
        },
        {
          template_id: templateId,
          field_name: 'kvk_nummer',
          field_label: 'KvK Nummer',
          field_type: 'text' as const,
          is_required: true,
          placeholder: '12345678',
          sort_order: 1
        },
        {
          template_id: templateId,
          field_name: 'btw_nummer',
          field_label: 'BTW Nummer',
          field_type: 'text' as const,
          is_required: false,
          placeholder: 'NL123456789B01',
          sort_order: 2
        },
        {
          template_id: templateId,
          field_name: 'contactpersoon',
          field_label: 'Contactpersoon',
          field_type: 'text' as const,
          is_required: true,
          placeholder: 'Voor- en achternaam',
          sort_order: 3
        },
        {
          template_id: templateId,
          field_name: 'email',
          field_label: 'E-mail',
          field_type: 'email' as const,
          is_required: true,
          placeholder: 'contact@bedrijf.nl',
          sort_order: 4
        },
        {
          template_id: templateId,
          field_name: 'telefoon',
          field_label: 'Telefoon',
          field_type: 'phone' as const,
          is_required: true,
          placeholder: '+31 6 12345678',
          sort_order: 5
        },
        {
          template_id: templateId,
          field_name: 'adres_type',
          field_label: 'Type Adresgebruik',
          field_type: 'select' as const,
          field_options: [
            'Vestigingsadres',
            'Correspondentieadres',
            'Postadres',
            'Vestigings- en correspondentieadres'
          ],
          is_required: true,
          sort_order: 6
        },
        {
          template_id: templateId,
          field_name: 'bedrijfsadres',
          field_label: 'Bedrijfsadres',
          field_type: 'textarea' as const,
          is_required: true,
          placeholder: 'Straatnaam 123\n1234AB Plaatsnaam',
          sort_order: 7
        },
        {
          template_id: templateId,
          field_name: 'aanvullende_diensten',
          field_label: 'Aanvullende Diensten',
          field_type: 'textarea' as const,
          is_required: false,
          placeholder: 'Beschrijf eventuele aanvullende diensten...',
          sort_order: 8
        },
        {
          template_id: templateId,
          field_name: 'maandelijkse_vergoeding',
          field_label: 'Maandelijkse Vergoeding',
          field_type: 'text' as const,
          is_required: true,
          placeholder: '€150,00',
          sort_order: 9
        },
        {
          template_id: templateId,
          field_name: 'betalingstermijn',
          field_label: 'Betalingstermijn',
          field_type: 'select' as const,
          field_options: [
            '14 dagen',
            '30 dagen',
            'Direct',
            'Vooruitbetaling'
          ],
          is_required: true,
          sort_order: 10
        },
        {
          template_id: templateId,
          field_name: 'eerste_betaling_datum',
          field_label: 'Eerste Betaling Uiterlijk',
          field_type: 'date' as const,
          is_required: true,
          sort_order: 11
        },
        {
          template_id: templateId,
          field_name: 'startdatum',
          field_label: 'Startdatum Contract',
          field_type: 'date' as const,
          is_required: true,
          sort_order: 12
        },
        {
          template_id: templateId,
          field_name: 'einddatum',
          field_label: 'Einddatum Contract',
          field_type: 'date' as const,
          is_required: true,
          sort_order: 13
        },
        {
          template_id: templateId,
          field_name: 'opzegtermijn',
          field_label: 'Opzegtermijn',
          field_type: 'select' as const,
          field_options: [
            '1 maand',
            '2 maanden',
            '3 maanden',
            '6 maanden'
          ],
          is_required: true,
          sort_order: 14
        },
        {
          template_id: templateId,
          field_name: 'bijzondere_bepalingen',
          field_label: 'Bijzondere Bepalingen',
          field_type: 'textarea' as const,
          is_required: false,
          placeholder: 'Eventuele bijzondere bepalingen of afspraken...',
          sort_order: 15
        }
      ];

      // Step 5: Delete existing fields and insert new ones
      const { error: deleteError } = await supabase
        .from('contract_template_fields')
        .delete()
        .eq('template_id', templateId);

      if (deleteError) throw deleteError;

      // Step 6: Insert all new Dutch template fields
      const { error: insertError } = await supabase
        .from('contract_template_fields')
        .insert(dutchTemplateFields);

      if (insertError) throw insertError;

      toast({
        title: "Sjabloon bijgewerkt",
        description: "Het sjabloon is succesvol bijgewerkt met de Nederlandse bedrijfsadres contract inhoud en velden.",
      });

      onTemplateUpdated();

    } catch (error: any) {
      console.error('Error applying Dutch template:', error);
      toast({
        title: "Fout bij bijwerken",
        description: error.message || "Er is een fout opgetreden bij het bijwerken van het sjabloon.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Nederlandse Contract Toepassen
        </CardTitle>
        <CardDescription>
          Werk "{templateTitle}" bij met de Nederlandse bedrijfsadres contract inhoud
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Wat wordt bijgewerkt:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Contract titel en beschrijving</li>
              <li>• Volledige contract inhoud in het Nederlands</li>
              <li>• 16 gespecialiseerde formuliervelden</li>
              <li>• Status wordt ingesteld op "Actief"</li>
              <li>• Bestaande velden worden vervangen</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Let op:</strong> Deze actie vervangt alle bestaande inhoud en velden van het sjabloon. 
              Deze actie kan niet ongedaan worden gemaakt.
            </p>
          </div>
          
          <Button 
            onClick={applyDutchTemplate}
            disabled={isApplying}
            className="w-full"
            size="lg"
          >
            {isApplying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sjabloon wordt bijgewerkt...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Nederlandse Contract Toepassen
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DutchTemplateApplicator;
