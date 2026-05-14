
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Plus } from "lucide-react";
import { dutchAddressContractTemplate } from "@/utils/dutch-address-template";

interface DutchAddressTemplateCreatorProps {
  onTemplateCreated: () => void;
}

const DutchAddressTemplateCreator: React.FC<DutchAddressTemplateCreatorProps> = ({
  onTemplateCreated
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = React.useState(false);

  const createTemplate = async () => {
    if (!user?.id) {
      toast({
        title: "Authenticatie vereist",
        description: "U moet ingelogd zijn om een sjabloon aan te maken.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Create the template
      const { data: template, error: templateError } = await supabase
        .from('contract_templates')
        .insert({
          title: dutchAddressContractTemplate.title,
          description: dutchAddressContractTemplate.description,
          content: dutchAddressContractTemplate.content,
          status: dutchAddressContractTemplate.status,
          created_by: user.id
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Define the template fields based on the placeholders
      const templateFields = [
        {
          template_id: template.id,
          field_name: 'bedrijfsnaam',
          field_label: 'Bedrijfsnaam',
          field_type: 'text' as const,
          is_required: true,
          placeholder: 'Naam van het bedrijf',
          sort_order: 0
        },
        {
          template_id: template.id,
          field_name: 'kvk_nummer',
          field_label: 'KvK Nummer',
          field_type: 'text' as const,
          is_required: true,
          placeholder: '12345678',
          sort_order: 1
        },
        {
          template_id: template.id,
          field_name: 'btw_nummer',
          field_label: 'BTW Nummer',
          field_type: 'text' as const,
          is_required: false,
          placeholder: 'NL123456789B01',
          sort_order: 2
        },
        {
          template_id: template.id,
          field_name: 'contactpersoon',
          field_label: 'Contactpersoon',
          field_type: 'text' as const,
          is_required: true,
          placeholder: 'Voor- en achternaam',
          sort_order: 3
        },
        {
          template_id: template.id,
          field_name: 'email',
          field_label: 'E-mail',
          field_type: 'email' as const,
          is_required: true,
          placeholder: 'contact@bedrijf.nl',
          sort_order: 4
        },
        {
          template_id: template.id,
          field_name: 'telefoon',
          field_label: 'Telefoon',
          field_type: 'phone' as const,
          is_required: true,
          placeholder: '+31 6 12345678',
          sort_order: 5
        },
        {
          template_id: template.id,
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
          template_id: template.id,
          field_name: 'bedrijfsadres',
          field_label: 'Bedrijfsadres',
          field_type: 'textarea' as const,
          is_required: true,
          placeholder: 'Straatnaam 123\n1234AB Plaatsnaam',
          sort_order: 7
        },
        {
          template_id: template.id,
          field_name: 'aanvullende_diensten',
          field_label: 'Aanvullende Diensten',
          field_type: 'textarea' as const,
          is_required: false,
          placeholder: 'Beschrijf eventuele aanvullende diensten...',
          sort_order: 8
        },
        {
          template_id: template.id,
          field_name: 'maandelijkse_vergoeding',
          field_label: 'Maandelijkse Vergoeding',
          field_type: 'text' as const,
          is_required: true,
          placeholder: '€150,00',
          sort_order: 9
        },
        {
          template_id: template.id,
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
          template_id: template.id,
          field_name: 'eerste_betaling_datum',
          field_label: 'Eerste Betaling Uiterlijk',
          field_type: 'date' as const,
          is_required: true,
          sort_order: 11
        },
        {
          template_id: template.id,
          field_name: 'startdatum',
          field_label: 'Startdatum Contract',
          field_type: 'date' as const,
          is_required: true,
          sort_order: 12
        },
        {
          template_id: template.id,
          field_name: 'einddatum',
          field_label: 'Einddatum Contract',
          field_type: 'date' as const,
          is_required: true,
          sort_order: 13
        },
        {
          template_id: template.id,
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
          template_id: template.id,
          field_name: 'bijzondere_bepalingen',
          field_label: 'Bijzondere Bepalingen',
          field_type: 'textarea' as const,
          is_required: false,
          placeholder: 'Eventuele bijzondere bepalingen of afspraken...',
          sort_order: 15
        }
      ];

      // Insert all template fields
      const { error: fieldsError } = await supabase
        .from('contract_template_fields')
        .insert(templateFields);

      if (fieldsError) throw fieldsError;

      toast({
        title: "Sjabloon aangemaakt",
        description: "Het bedrijfsadres contract sjabloon is succesvol aangemaakt met alle benodigde velden.",
      });

      onTemplateCreated();

    } catch (error: any) {
      console.error('Error creating template:', error);
      toast({
        title: "Fout bij aanmaken",
        description: error.message || "Er is een fout opgetreden bij het aanmaken van het sjabloon.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Nederlands Bedrijfsadres Contract
        </CardTitle>
        <CardDescription>
          Maak een professioneel contract sjabloon aan voor bedrijfsadres dienstverlening
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Sjabloon bevat:</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Complete contractstructuur in het Nederlands</li>
              <li>• 16 automatisch gegenereerde formuliervelden</li>
              <li>• Intelligente veldtypes (tekst, datum, dropdown, etc.)</li>
              <li>• PDF export met Nederlandse formatting</li>
              <li>• Handtekening secties</li>
              <li>• Juridisch correcte bepalingen</li>
            </ul>
          </div>
          
          <Button 
            onClick={createTemplate}
            disabled={isCreating}
            className="w-full"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Sjabloon wordt aangemaakt..." : "Maak Bedrijfsadres Contract Sjabloon"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DutchAddressTemplateCreator;
