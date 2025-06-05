
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AddressRequestData {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  preferred_address_type: string;
  business_type: string;
  expected_mail_volume: string;
  additional_services: string[];
  special_requirements: string;
  user_id: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: AddressRequestData = await req.json();
    
    console.log("Received address request notification data:", requestData);
    
    // Get SMTP settings from environment variables
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const smtpUsername = Deno.env.get("SMTP_USERNAME");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const adminEmail = "info@edutchmanagement.nl";
    const senderName = Deno.env.get("SENDER_NAME") || "eDutchmanagement";
    
    // Check if all required environment variables are set
    if (!smtpHost || !smtpPort || !smtpUsername || !smtpPassword) {
      throw new Error("SMTP configuration is incomplete");
    }
    
    console.log(`Configuring SMTP client for address request notification`);
    
    // Configure SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUsername,
          password: smtpPassword,
        }
      }
    });
    
    console.log("SMTP client configured successfully");
    
    // Format additional services for email
    const servicesText = requestData.additional_services.length > 0 
      ? requestData.additional_services.join(", ")
      : "Geen extra diensten geselecteerd";
    
    // Format address type
    const addressTypeLabels = {
      basic: "Basis Pakket",
      premium: "Premium Pakket",
      complete: "Complete Pakket"
    };
    const addressTypeLabel = addressTypeLabels[requestData.preferred_address_type as keyof typeof addressTypeLabels] || requestData.preferred_address_type;
    
    // Create plain text version for admin
    const adminTextContent = `
Nieuwe Bedrijfsadres Aanvraag

Bedrijfsinformatie:
Bedrijfsnaam: ${requestData.company_name}
Contactpersoon: ${requestData.contact_person}
Type bedrijf: ${requestData.business_type}

Contactgegevens:
E-mail: ${requestData.email}
Telefoon: ${requestData.phone || "Niet opgegeven"}

Aanvraag Details:
Gewenst adrespakket: ${addressTypeLabel}
Verwacht postvolume: ${requestData.expected_mail_volume}
Extra diensten: ${servicesText}

${requestData.special_requirements ? `Bijzondere wensen:\n${requestData.special_requirements}\n` : ''}
Account Status:
Gebruiker ID: ${requestData.user_id || "Anonieme aanvraag"}

Deze aanvraag is automatisch gegenereerd via het online aanvraagformulier.
    `.trim();

    // Create HTML content for admin
    const adminHtmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Nieuwe Bedrijfsadres Aanvraag</title>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
h2 { color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px; }
h3 { color: #444; margin-top: 25px; margin-bottom: 10px; }
.info-block { background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #2c5aa0; }
.label { font-weight: bold; }
.footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-style: italic; color: #666; }
</style>
</head>
<body>
<h2>Nieuwe Bedrijfsadres Aanvraag</h2>

<h3>Bedrijfsinformatie</h3>
<div class="info-block">
<p><span class="label">Bedrijfsnaam:</span> ${requestData.company_name}</p>
<p><span class="label">Contactpersoon:</span> ${requestData.contact_person}</p>
<p><span class="label">Type bedrijf:</span> ${requestData.business_type}</p>
</div>

<h3>Contactgegevens</h3>
<div class="info-block">
<p><span class="label">E-mail:</span> ${requestData.email}</p>
<p><span class="label">Telefoon:</span> ${requestData.phone || "Niet opgegeven"}</p>
</div>

<h3>Aanvraag Details</h3>
<div class="info-block">
<p><span class="label">Gewenst adrespakket:</span> ${addressTypeLabel}</p>
<p><span class="label">Verwacht postvolume:</span> ${requestData.expected_mail_volume}</p>
<p><span class="label">Extra diensten:</span> ${servicesText}</p>
</div>

${requestData.special_requirements ? `<h3>Bijzondere wensen</h3>
<div class="info-block">
<p>${requestData.special_requirements}</p>
</div>` : ''}

<h3>Account Status</h3>
<div class="info-block">
<p><span class="label">Gebruiker ID:</span> ${requestData.user_id || "Anonieme aanvraag"}</p>
</div>

<div class="footer">
<p>Deze aanvraag is automatisch gegenereerd via het online aanvraagformulier.</p>
</div>
</body>
</html>`;
    
    // Send notification email to admin
    try {
      await client.send({
        from: `${senderName} <${smtpUsername}>`,
        to: adminEmail,
        subject: `Nieuwe bedrijfsadres aanvraag van ${requestData.company_name}`,
        html: adminHtmlContent,
        text: adminTextContent,
        replyTo: requestData.email
      });
      
      console.log("Address request notification email sent successfully");
      
      // Send confirmation email to sender
      await client.send({
        from: `${senderName} <${smtpUsername}>`,
        to: requestData.email,
        subject: "Bevestiging van uw bedrijfsadres aanvraag",
        html: `
          <h2>Bedankt voor uw aanvraag!</h2>
          <p>Beste ${requestData.contact_person},</p>
          <p>Wij hebben uw aanvraag voor een bedrijfsadres in goede orde ontvangen en zullen deze zo spoedig mogelijk behandelen.</p>
          <p>Hieronder vindt u een overzicht van uw aanvraag:</p>
          <hr>
          <h3>Bedrijfsinformatie</h3>
          <p><strong>Bedrijfsnaam:</strong> ${requestData.company_name}</p>
          <p><strong>Contactpersoon:</strong> ${requestData.contact_person}</p>
          <p><strong>Type bedrijf:</strong> ${requestData.business_type}</p>
          
          <h3>Contactgegevens</h3>
          <p><strong>E-mail:</strong> ${requestData.email}</p>
          <p><strong>Telefoon:</strong> ${requestData.phone || "Niet opgegeven"}</p>
          
          <h3>Aanvraag Details</h3>
          <p><strong>Gewenst adrespakket:</strong> ${addressTypeLabel}</p>
          <p><strong>Verwacht postvolume:</strong> ${requestData.expected_mail_volume}</p>
          <p><strong>Extra diensten:</strong> ${servicesText}</p>
          
          ${requestData.special_requirements ? `<h3>Bijzondere wensen</h3><p>${requestData.special_requirements}</p>` : ''}
          
          <hr>
          <p>Wij nemen binnen 24 uur contact met u op om de volgende stappen te bespreken.</p>
          <p>Heeft u nog vragen? Neem dan gerust contact met ons op via ${smtpUsername} of bezoek onze website.</p>
          <p>Met vriendelijke groet,</p>
          <p>${senderName}</p>
        `
      });
      
      console.log("Confirmation email sent successfully");
      
    } catch (emailError) {
      console.error("Error sending address request notification email:", emailError);
      throw new Error(`Fout bij het verzenden van notificatie e-mail: ${emailError.message}`);
    } finally {
      // Close the SMTP connection
      await client.close();
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Address request notification sent successfully" }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error processing address request notification:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Fout bij verwerken notificatie", 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
