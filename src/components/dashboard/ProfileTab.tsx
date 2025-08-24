
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Mail, Phone, MapPin, Edit3, Save, X } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileTabProps {
  user: SupabaseUser;
}

interface ProfileData {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  business_address?: string;
  kvk_number?: string;
  vat_number?: string;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [originalData, setOriginalData] = useState<ProfileData>({});
  const { toast } = useToast();

  // Laad profiel data
  useEffect(() => {
    fetchProfileData();
  }, [user.id]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      const profile = data || {};
      setProfileData(profile);
      setOriginalData(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast({
          title: "Fout bij opslaan",
          description: "Er ging iets mis bij het opslaan van uw gegevens.",
          variant: "destructive",
        });
        return;
      }

      setOriginalData(profileData);
      setIsEditing(false);
      toast({
        title: "Gegevens opgeslagen",
        description: "Uw profielgegevens zijn succesvol bijgewerkt.",
      });
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Er ging iets mis bij het opslaan van uw gegevens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profielgegevens
          </CardTitle>
          <CardDescription>
            {isEditing ? "Bewerk uw persoonlijke en bedrijfsgegevens" : "Uw persoonlijke en bedrijfsgegevens"}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Annuleren
              </Button>
              <Button onClick={handleSave} size="sm" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Opslaan..." : "Opslaan"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Bewerken
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Persoonlijke gegevens */}
        <div>
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Persoonlijke gegevens
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Voornaam</Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={profileData.first_name || ''}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  placeholder="Voornaam"
                />
              ) : (
                <p className="text-sm mt-1 p-2 bg-muted/50 rounded">{profileData.first_name || 'Niet ingevuld'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Achternaam</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={profileData.last_name || ''}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  placeholder="Achternaam"
                />
              ) : (
                <p className="text-sm mt-1 p-2 bg-muted/50 rounded">{profileData.last_name || 'Niet ingevuld'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">E-mailadres</Label>
              <p className="text-sm mt-1 p-2 bg-muted/50 rounded flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bedrijfsgegevens */}
        <div>
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Bedrijfsgegevens
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="company_name">Bedrijfsnaam</Label>
              {isEditing ? (
                <Input
                  id="company_name"
                  value={profileData.company_name || ''}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  placeholder="Naam van uw bedrijf"
                />
              ) : (
                <p className="text-sm mt-1 p-2 bg-muted/50 rounded">{profileData.company_name || 'Niet ingevuld'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Telefoonnummer</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={profileData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+31 6 12345678"
                />
              ) : (
                <p className="text-sm mt-1 p-2 bg-muted/50 rounded flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {profileData.phone || 'Niet ingevuld'}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="kvk_number">KvK nummer</Label>
              {isEditing ? (
                <Input
                  id="kvk_number"
                  value={profileData.kvk_number || ''}
                  onChange={(e) => updateField('kvk_number', e.target.value)}
                  placeholder="12345678"
                />
              ) : (
                <p className="text-sm mt-1 p-2 bg-muted/50 rounded">{profileData.kvk_number || 'Niet ingevuld'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="business_address">Bedrijfsadres</Label>
              {isEditing ? (
                <Input
                  id="business_address"
                  value={profileData.business_address || ''}
                  onChange={(e) => updateField('business_address', e.target.value)}
                  placeholder="Straatnaam 123, 1234 AB Stad"
                />
              ) : (
                <p className="text-sm mt-1 p-2 bg-muted/50 rounded flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {profileData.business_address || 'Niet ingevuld'}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="vat_number">BTW nummer</Label>
              {isEditing ? (
                <Input
                  id="vat_number"
                  value={profileData.vat_number || ''}
                  onChange={(e) => updateField('vat_number', e.target.value)}
                  placeholder="NL123456789B01"
                />
              ) : (
                <p className="text-sm mt-1 p-2 bg-muted/50 rounded">{profileData.vat_number || 'Niet ingevuld'}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
