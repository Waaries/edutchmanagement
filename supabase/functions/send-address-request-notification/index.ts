
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
    
    // Send notification email to admin
    try {
      await client.send({
        from: `${senderName} <${smtpUsername}>`,
        to: adminEmail,
        subject: `Nieuwe bedrijfsadres aanvraag van ${requestData.company_name}`,
        html: `
          <h2>Nieuwe Bedrijfsadres Aanvraag</h2>
          
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
          
          ${requestData.special_requirements ? `
          <h3>Bijzondere wensen</h3>
          <p>${requestData.special_requirements}</p>
          ` : ''}
          
          <h3>Account Status</h3>
          <p><strong>Gebruiker ID:</strong> ${requestData.user_id || "Anonieme aanvraag"}</p>
          
          <hr>
          <p><em>Deze aanvraag is automatisch gegenereerd via het online aanvraagformulier.</em></p>
        `,
        replyTo: requestData.email
      });
      
      console.log("Address request notification email sent successfully");
      
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
