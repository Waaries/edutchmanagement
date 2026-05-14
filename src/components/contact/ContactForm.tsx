
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFormTracking } from "@/hooks/use-monitoring";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactForm = () => {
  const { translate } = useLanguage();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      trackFormError('Validation error: Missing required fields');
      toast({
        title: translate("contact.form.validationTitle"),
        description: translate("contact.form.validationMsg"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    trackFormStart();

    try {
      console.log('Submitting contact form via secure endpoint');
      
      // Use the new secure contact submission endpoint with rate limiting
      const { data, error } = await supabase.functions.invoke('secure-contact-submit', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || null,
          message: formData.message.trim()
        }
      });

      if (error) {
        console.error('Secure contact submission error:', error);
        trackFormSubmit(false, [error.message]);
        
        if (error.message?.includes('rate limit')) {
          toast({
            title: "Te veel verzoeken",
            description: "Maximum 3 berichten per uur toegestaan. Wacht even voordat u een nieuw bericht verzendt.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fout",
            description: "Kan bericht niet verzenden. Probeer het opnieuw.",
            variant: "destructive",
          });
        }
        return;
      }

      if (data?.error) {
        console.error('Contact submission failed:', data.error);
        trackFormSubmit(false, [data.error]);
        
        if (data.error.includes('rate limit')) {
          toast({
            title: "Te veel verzoeken",
            description: "Maximum 3 berichten per uur toegestaan. Wacht even voordat u een nieuw bericht verzendt.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fout", 
            description: data.error,
            variant: "destructive",
          });
        }
        return;
      }

      console.log('Contact message submitted successfully:', data);
      trackFormSubmit(true);

      toast({
        title: "Bericht verzonden!",
        description: "Dank u voor uw bericht. We nemen binnen 24 uur contact met u op.",
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
      console.error('Failed to submit contact form:', error);
      trackFormSubmit(false, [error.message]);
      toast({
        title: "Fout",
        description: "Er is een onverwachte fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{translate("contact.form.title")}</CardTitle>
        <CardDescription>{translate("contact.form.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{translate("contact.form.name")} *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder={translate("contact.form.namePlace")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{translate("contact.form.email")} *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder={translate("contact.form.emailPlace")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{translate("contact.form.phone")}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={translate("contact.form.phonePlace")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">{translate("contact.form.subject")}</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder={translate("contact.form.subjectPlace")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{translate("contact.form.message")} *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              placeholder={translate("contact.form.messagePlaceholder")}
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
                {translate("contact.form.sendingBtn")}
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                {translate("contact.form.sendBtn")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
