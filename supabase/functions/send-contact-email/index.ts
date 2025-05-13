
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

// Configure SMTP client
const client = new SMTPClient({
  connection: {
    hostname: Deno.env.get("SMTP_HOST") || "",
    port: Number(Deno.env.get("SMTP_PORT")) || 587,
    tls: true,
    auth: {
      username: Deno.env.get("SMTP_USERNAME") || "",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    }
  }
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message }: ContactFormData = await req.json();
    
    console.log("Received contact form data:", { name, email, phone, service, message });
    
    // Verify all required SMTP environment variables are set
    const requiredEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USERNAME", "SMTP_PASSWORD", "ADMIN_EMAIL"];
    const missingEnvVars = requiredEnvVars.filter(varName => !Deno.env.get(varName));
    
    if (missingEnvVars.length > 0) {
      console.error("Missing required environment variables:", missingEnvVars);
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
    }
    
    // Build email content
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "";
    const replyToEmail = email;
    
    // Email to admin
    await client.send({
      from: Deno.env.get("SMTP_USERNAME") || "",
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
      replyTo: replyToEmail
    });
    
    // Confirmation email to sender
    await client.send({
      from: Deno.env.get("SMTP_USERNAME") || "",
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
        <p>Het Team</p>
      `
    });
    
    console.log("Emails sent successfully");
    
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
        message: "Failed to process contact form", 
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
