
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, UserCheck, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFormTracking } from "@/hooks/use-monitoring";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();
  const { trackFormStart, trackFormSubmit, trackFormError } = useFormTracking('contact_form');
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication first
    if (!user || !session) {
      trackFormError('Authentication error: User not logged in');
      toast({
        title: "Authenticatie vereist",
        description: "U moet ingelogd zijn om een bericht te verzenden. Ga naar de inlogpagina.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name || !formData.email || !formData.message) {
      trackFormError('Validation error: Missing required fields');
      toast({
        title: "Fout",
        description: "Vul alle verplichte velden in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    trackFormStart();

    try {
      // Store in database first
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: 'unread'
        }]);

      if (dbError) throw dbError;

      // Then try to send email
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      trackFormSubmit(true);
      
      toast({
        title: "Bericht verzonden!",
        description: "We nemen zo snel mogelijk contact met u op.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error: any) {
      console.error('Error sending message:', error);
      trackFormSubmit(false, [error.message]);
      
      // Check if it's an authentication error
      if (error.message?.includes('insufficient_privilege') || error.message?.includes('policy')) {
        toast({
          title: "Authenticatie vereist",
          description: "U moet ingelogd zijn om een bericht te verzenden.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fout bij verzenden",
          description: "Er is een fout opgetreden. Probeer het later opnieuw.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state during auth initialization
  if (authLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Bezig met laden...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show authentication required message
  if (!user || !session) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <UserCheck className="h-6 w-6" />
            Inloggen vereist
          </CardTitle>
          <CardDescription>
            Om een bericht te verzenden moet u eerst inloggen.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Voor uw veiligheid en om spam te voorkomen, vereisen we dat u ingelogd bent voordat u een bericht kunt verzenden.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Inloggen / Registreren
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Stuur ons een bericht</CardTitle>
        <CardDescription>
          Vul het formulier in en we nemen binnen 24 uur contact met u op.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Uw volledige naam"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="uw.email@example.com"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefoon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+31 6 12345678"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Onderwerp</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Waar gaat uw vraag over?"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Bericht *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              placeholder="Beschrijf uw vraag of wens in detail..."
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verzenden...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Bericht Verzenden
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
