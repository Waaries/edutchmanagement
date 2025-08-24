import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  onOpenChange,
  onUserCreated
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setIsAdmin(false);
    setSendEmail(true);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
  };

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError("Voer een geldig e-mailadres in");
      return false;
    }
    if (!password || password.length < 8) {
      setError("Wachtwoord moet minimaal 8 karakters lang zijn");
      return false;
    }
    return true;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Call the create user edge function
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email,
          password,
          firstName,
          lastName,
          isAdmin,
          sendEmail
        }
      });

      if (error) throw error;

      toast({
        title: "Gebruiker aangemaakt",
        description: `${email} is succesvol aangemaakt${sendEmail ? ' en een uitnodigingsmail is verzonden' : ''}.`,
      });

      handleClose();
      onUserCreated();
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || "Er is een fout opgetreden bij het aanmaken van de gebruiker.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Nieuwe Gebruiker Aanmaken
          </DialogTitle>
          <DialogDescription>
            Maak een nieuwe gebruikersaccount aan. Een willekeurig wachtwoord wordt gegenereerd tenzij je er zelf een invoert.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres *</Label>
            <Input
              id="email"
              type="email"
              placeholder="gebruiker@voorbeeld.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Voornaam</Label>
              <Input
                id="firstName"
                placeholder="Jan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Achternaam</Label>
              <Input
                id="lastName"
                placeholder="Jansen"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Wachtwoord *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePassword}
                disabled={loading}
              >
                Genereer
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Minimaal 8 karakters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Administrator rechten</Label>
                <p className="text-sm text-muted-foreground">
                  Geef deze gebruiker admin toegang
                </p>
              </div>
              <Switch
                checked={isAdmin}
                onCheckedChange={setIsAdmin}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Uitnodigingsmail verzenden</Label>
                <p className="text-sm text-muted-foreground">
                  Stuur een welkomstmail naar de gebruiker
                </p>
              </div>
              <Switch
                checked={sendEmail}
                onCheckedChange={setSendEmail}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Annuleren
          </Button>
          <Button onClick={handleCreateUser} disabled={loading || !email || !password}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gebruiker Aanmaken
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;