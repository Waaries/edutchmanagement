
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message }: ContactFormData = await req.json();
    
    console.log("Received contact form data:", { name, email, phone, service, message });
    
    // Haal SMTP instellingen op uit environment variables
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUsername = Deno.env.get("SMTP_USERNAME");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const senderName = Deno.env.get("SENDER_NAME") || "E-Dutch Management";
    
    // Log de SMTP instellingen (zonder wachtwoord)
    console.log("SMTP settings:", {
      host: smtpHost,
      port: smtpPort,
      username: smtpUsername,
      adminEmail: adminEmail,
      senderName: senderName
    });
    
    // Controleer of alle vereiste omgevingsvariabelen zijn ingesteld
    const missingEnvVars = [];
    
    if (!smtpHost) missingEnvVars.push("SMTP_HOST");
    if (!smtpPort) missingEnvVars.push("SMTP_PORT");
    if (!smtpUsername) missingEnvVars.push("SMTP_USERNAME");
    if (!smtpPassword) missingEnvVars.push("SMTP_PASSWORD");
    if (!adminEmail) missingEnvVars.push("ADMIN_EMAIL");
    
    if (missingEnvVars.length > 0) {
      console.error("Ontbrekende omgevingsvariabelen:", missingEnvVars);
      throw new Error(`Ontbrekende configuratie: ${missingEnvVars.join(", ")}. Controleer de Edge Function instellingen.`);
    }
    
    console.log(`Configuring SMTP client with host: ${smtpHost}, port: ${smtpPort}`);
    
    try {
      // Configureer SMTP client
      const client = new SMTPClient({
        connection: {
          hostname: smtpHost,
          port: Number(smtpPort) || 587,
          tls: true,
          auth: {
            username: smtpUsername,
            password: smtpPassword,
          }
        }
      });
      
      console.log("SMTP client configured successfully");
      
      // Email naar beheerder
      await client.send({
        from: `${senderName} <${smtpUsername}>`,
        to: adminEmail,
        subject: `Nieuwe contactaanvraag van ${name}`,
        html: `
          <h2>Nieuwe contactaanvraag</h2>
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefoon:</strong> ${phone || "Niet opgegeven"}</p>
          <p><strong>Gewenst Pakket:</strong> ${service || "Niet opgegeven"}</p>
          <h3>Bericht:</h3>
          <p>${message}</p>
        `,
        replyTo: email
      });
      
      console.log("Admin email sent successfully");
      
      // Bevestigingse-mail naar afzender
      await client.send({
        from: `${senderName} <${smtpUsername}>`,
        to: email,
        subject: "Bedankt voor uw bericht",
        html: `
          <h2>Bedankt voor uw bericht!</h2>
          <p>Beste ${name},</p>
          <p>Wij hebben uw bericht in goede orde ontvangen en zullen zo spoedig mogelijk contact met u opnemen.</p>
          <p>Hieronder vindt u een kopie van uw bericht:</p>
          <hr>
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefoon:</strong> ${phone || "Niet opgegeven"}</p>
          <p><strong>Gewenst Pakket:</strong> ${service || "Niet opgegeven"}</p>
          <p><strong>Bericht:</strong></p>
          <p>${message}</p>
          <hr>
          <p>Met vriendelijke groet,</p>
          <p>E-Dutch Management</p>
        `
      });
      
      console.log("Confirmation email sent successfully");
      
      // Sluit de SMTP connectie
      await client.close();
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      throw new Error(`Fout bij het verzenden van e-mail: ${emailError.message}`);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Contact form submitted successfully" }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Fout bij verwerken contactformulier", 
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
