
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContractTemplate {
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
}

interface TemplateBasicInfoFormProps {
  template: ContractTemplate;
  onTemplateChange: (template: ContractTemplate) => void;
}

const TemplateBasicInfoForm: React.FC<TemplateBasicInfoFormProps> = ({
  template,
  onTemplateChange
}) => {
  return (
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
            onChange={(e) => onTemplateChange({ ...template, title: e.target.value })}
            placeholder="Voer een titel in"
          />
        </div>

        <div>
          <Label htmlFor="description">Beschrijving</Label>
          <Textarea
            id="description"
            value={template.description}
            onChange={(e) => onTemplateChange({ ...template, description: e.target.value })}
            placeholder="Optionele beschrijving"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={template.status}
            onValueChange={(value) => onTemplateChange({ ...template, status: value as any })}
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
            onChange={(e) => onTemplateChange({ ...template, content: e.target.value })}
            placeholder="Voer de contract inhoud in. Gebruik {{field_name}} voor variabele velden."
            rows={8}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Gebruik dubbele accolades zoals {`{{field_name}}`} om variabele velden in te voegen.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateBasicInfoForm;
