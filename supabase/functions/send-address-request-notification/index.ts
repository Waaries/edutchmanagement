
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AddressRequestData, corsHeaders } from "./types.ts";
import { validateSMTPConfig, createSMTPClient } from "./smtp-client.ts";
import { sendAdminNotification, sendConfirmationEmail } from "./email-sender.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: AddressRequestData = await req.json();
    
    console.log("Received address request notification data:", requestData);
    
    // Validate SMTP configuration
    const smtpConfig = validateSMTPConfig();
    const adminEmail = "info@edutchmanagement.nl";
    const senderName = Deno.env.get("SENDER_NAME") || "eDutchmanagement";
    
    // Create SMTP client
    const client = createSMTPClient(smtpConfig);
    
    try {
      // Send notification email to admin
      await sendAdminNotification(
        client,
        requestData,
        smtpConfig.username,
        senderName,
        adminEmail
      );
      
      // Send confirmation email to sender
      await sendConfirmationEmail(
        client,
        requestData,
        smtpConfig.username,
        senderName
      );
      
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
