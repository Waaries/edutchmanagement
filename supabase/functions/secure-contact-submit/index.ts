import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client info
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    console.log(`Contact form submission from IP: ${clientIP}`);

    // Parse request body
    const { name, email, phone, message } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, and message are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limiting (3 submissions per hour per IP)
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        client_ip: clientIP,
        action_name: 'contact_form_submission',
        max_attempts: 3,
        time_window: '1 hour'
      });

    if (rateLimitError) {
      console.error('Rate limit check failed:', rateLimitError);
    } else if (!rateLimitCheck) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      
      // Log the rate limit violation
      await supabase.from('security_audit_logs').insert({
        action: 'rate_limit_exceeded',
        resource_type: 'contact_messages',
        success: false,
        error_message: 'Contact form rate limit exceeded',
        ip_address: clientIP,
        user_agent: userAgent,
        metadata: {
          attempted_submission: { name, email: email.substring(0, 3) + '***', phone }
        }
      });

      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait before submitting another message. Maximum 3 submissions per hour allowed.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert contact message
    const { data: contactData, error: contactError } = await supabase
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        message: message.trim(),
        status: 'unread'
      })
      .select()
      .single();

    if (contactError) {
      console.error('Error inserting contact message:', contactError);
      
      // Log the failed submission
      await supabase.from('security_audit_logs').insert({
        action: 'contact_submission_failed',
        resource_type: 'contact_messages',
        success: false,
        error_message: contactError.message,
        ip_address: clientIP,
        user_agent: userAgent,
        metadata: {
          attempted_submission: { name, email: email.substring(0, 3) + '***', phone }
        }
      });

      return new Response(
        JSON.stringify({ error: 'Failed to submit contact message. Please try again.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log successful submission
    await supabase.from('security_audit_logs').insert({
      action: 'contact_submission_success',
      resource_type: 'contact_messages',
      resource_id: contactData.id,
      success: true,
      ip_address: clientIP,
      user_agent: userAgent,
      metadata: {
        contact_name: name,
        contact_email: email.substring(0, 3) + '***'
      }
    });

    console.log(`Contact message successfully submitted: ${contactData.id}`);

    // Send notification email (optional - can be enabled if SMTP is configured)
    try {
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name,
          email,
          phone,
          message
        }
      });

      if (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the entire request if email fails
      }
    } catch (emailErr) {
      console.error('Email notification error:', emailErr);
      // Continue - email is optional
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact message submitted successfully',
        id: contactData.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Secure contact submit error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});