
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

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

interface TemplateFieldEditorProps {
  field: TemplateField;
  index: number;
  onUpdateField: (index: number, updates: Partial<TemplateField>) => void;
  onRemoveField: (index: number) => void;
}

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

const TemplateFieldEditor: React.FC<TemplateFieldEditorProps> = ({
  field,
  index,
  onUpdateField,
  onRemoveField
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Veld {index + 1}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveField(index)}
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
            onChange={(e) => onUpdateField(index, { field_name: e.target.value })}
            placeholder="field_name"
          />
        </div>
        <div>
          <Label>Label</Label>
          <Input
            value={field.field_label}
            onChange={(e) => onUpdateField(index, { field_label: e.target.value })}
            placeholder="Veld Label"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select
            value={field.field_type}
            onValueChange={(value) => onUpdateField(index, { field_type: value as any })}
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
            onCheckedChange={(checked) => onUpdateField(index, { is_required: !!checked })}
          />
          <Label htmlFor={`required-${index}`}>Verplicht</Label>
        </div>
      </div>

      <div>
        <Label>Placeholder</Label>
        <Input
          value={field.placeholder || ''}
          onChange={(e) => onUpdateField(index, { placeholder: e.target.value })}
          placeholder="Optionele placeholder tekst"
        />
      </div>

      {field.field_type === 'select' && (
        <div>
          <Label>Opties (één per regel)</Label>
          <Textarea
            value={field.field_options?.join('\n') || ''}
            onChange={(e) => onUpdateField(index, { 
              field_options: e.target.value.split('\n').filter(option => option.trim()) 
            })}
            placeholder="Optie 1
Optie 2
Optie 3"
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

export default TemplateFieldEditor;
