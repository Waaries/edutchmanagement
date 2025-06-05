
import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SettingsTab = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('nl');
  const [saving, setSaving] = useState(false);
  
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simuleer het opslaan van instellingen
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Instellingen opgeslagen",
        description: "Uw voorkeursinstellingen zijn succesvol bijgewerkt.",
      });
    }, 1000);
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Notificatie-instellingen</CardTitle>
          <CardDescription>Beheer uw e-mail en app-notificaties</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">E-mail notificaties</Label>
              <p className="text-sm text-muted-foreground">
                Ontvang notificaties over uw afspraken via e-mail
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="browser-notifications">Browser notificaties</Label>
              <p className="text-sm text-muted-foreground">
                Ontvang notificaties in uw browser
              </p>
            </div>
            <Switch
              id="browser-notifications"
              defaultChecked
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing e-mails</Label>
              <p className="text-sm text-muted-foreground">
                Ontvang updates over nieuwe functies en aanbiedingen
              </p>
            </div>
            <Switch
              id="marketing-emails"
              defaultChecked={false}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Weergave-instellingen</CardTitle>
          <CardDescription>Personaliseer hoe de applicatie eruit ziet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Donkere modus</Label>
              <p className="text-sm text-muted-foreground">
                Schakel tussen lichte en donkere weergave
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={handleThemeToggle}
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="language">Taal</Label>
            <select 
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            >
              <option value="nl">Nederlands</option>
              <option value="en">Engels</option>
              <option value="de">Duits</option>
              <option value="fr">Frans</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2">
        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          className="w-full md:w-auto"
        >
          {saving ? "Bezig met opslaan..." : "Instellingen opslaan"}
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
