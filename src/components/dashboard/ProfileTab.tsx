
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Mail, Phone, MapPin, Edit3, Save, X, Plus } from "lucide-react";
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
  const [addressRequests, setAddressRequests] = useState<any[]>([]);
  const { toast } = useToast();

  // Laad profiel data
  useEffect(() => {
    fetchProfileData();
    fetchAddressRequests();
  }, [user.id]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
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

  const fetchAddressRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('address_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching address requests:', error);
        return;
      }

      setAddressRequests(data || []);
    } catch (error) {
      console.error('Error fetching address requests:', error);
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

  const getDisplayName = () => {
    if (profileData.first_name || profileData.last_name) {
      return `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
    }
    return user.email?.split('@')[0] || 'Gebruiker';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "In behandeling" },
      approved: { variant: "default" as const, label: "Goedgekeurd" },
      rejected: { variant: "destructive" as const, label: "Afgewezen" }
    };
    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Profiel Informatie */}
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

      {/* Adresaanvragen geschiedenis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Uw adresaanvragen
          </CardTitle>
          <CardDescription>
            Overzicht van alle adresaanvragen die u heeft ingediend
          </CardDescription>
        </CardHeader>
        <CardContent>
          {addressRequests.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">U heeft nog geen adresaanvragen ingediend</p>
              <Button onClick={() => window.location.href = '/address-request'}>
                <Plus className="h-4 w-4 mr-2" />
                Nieuwe aanvraag indienen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {addressRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{request.company_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Contactpersoon: {request.contact_person}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Aangevraagd op: {new Date(request.created_at).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-sm">
                    <p><strong>Type adres:</strong> {request.preferred_address_type}</p>
                    <p><strong>Bedrijfstype:</strong> {request.business_type}</p>
                    <p><strong>Verwacht postvolume:</strong> {request.expected_mail_volume}</p>
                  </div>
                  {request.admin_notes && (
                    <div className="mt-2 p-2 bg-muted/50 rounded">
                      <p className="text-sm"><strong>Opmerking van beheerder:</strong></p>
                      <p className="text-sm">{request.admin_notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
