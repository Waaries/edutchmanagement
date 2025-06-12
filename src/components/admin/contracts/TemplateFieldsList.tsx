
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TemplateFieldEditor from "./TemplateFieldEditor";

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

interface TemplateFieldsListProps {
  fields: TemplateField[];
  onAddField: () => void;
  onUpdateField: (index: number, updates: Partial<TemplateField>) => void;
  onRemoveField: (index: number) => void;
  onSyncFields?: () => number;
}

const TemplateFieldsList: React.FC<TemplateFieldsListProps> = ({
  fields,
  onAddField,
  onUpdateField,
  onRemoveField,
  onSyncFields
}) => {
  const { toast } = useToast();

  const handleSyncFields = () => {
    if (onSyncFields) {
      const newFieldsCount = onSyncFields();
      toast({
        title: "Velden gesynchroniseerd",
        description: `${newFieldsCount} placeholder(s) gevonden en toegevoegd als velden.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invulvelden</CardTitle>
            <CardDescription>
              Definieer de velden die klanten moeten invullen. Velden worden automatisch gedetecteerd uit de template content.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onSyncFields && (
              <Button 
                onClick={handleSyncFields} 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Sync placeholders
              </Button>
            )}
            <Button onClick={onAddField} size="sm" className="flex items-center gap-2">
              <Plus className="h-3 w-3" />
              Veld toevoegen
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nog geen velden toegevoegd.</p>
              <p className="text-sm">Voeg placeholders toe aan je template content (bijv. {{bedrijfsnaam}}) of klik op "Veld toevoegen".</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <TemplateFieldEditor
                key={index}
                field={field}
                index={index}
                onUpdateField={onUpdateField}
                onRemoveField={onRemoveField}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateFieldsList;
