
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // In a real implementation, you would use a service like Resend, SendGrid, etc.
    // For now, we'll just log the information and return a success response
    
    // Example of what email sending might look like with a service like Resend:
    // const { error } = await resend.emails.send({
    //   from: "noreply@yourcompany.com",
    //   to: "your-company-email@example.com",
    //   subject: "New Contact Form Submission",
    //   html: `
    //     <h1>New Contact Form Submission</h1>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone}</p>
    //     <p><strong>Service:</strong> ${service}</p>
    //     <p><strong>Message:</strong> ${message}</p>
    //   `,
    // });
    
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
