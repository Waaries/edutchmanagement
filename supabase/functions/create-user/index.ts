import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  sendEmail?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular Supabase client to verify the requesting user is admin
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the requesting user is an admin
    const { data: isAdminData, error: adminCheckError } = await supabase.rpc('is_admin');
    if (adminCheckError || !isAdminData) {
      console.error('Admin check failed:', adminCheckError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Only admins can create users' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const { email, password, firstName, lastName, isAdmin = false, sendEmail = true }: CreateUserRequest = await req.json();

    console.log(`[Create User] Attempting to create user: ${email}`);

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Create the user using admin client
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: !sendEmail, // If we're not sending email, auto-confirm
      user_metadata: {
        first_name: firstName || '',
        last_name: lastName || '',
      },
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(`[Create User] User created successfully: ${newUser.user?.id}`);

    // If the user should be an admin, add the admin role
    if (isAdmin && newUser.user?.id) {
      try {
        const { error: roleError } = await supabaseAdmin.rpc('add_admin_role', {
          user_id_param: newUser.user.id
        });

        if (roleError) {
          console.error('Error adding admin role:', roleError);
          // Don't fail the entire request, just log the error
        } else {
          console.log(`[Create User] Admin role added for user: ${newUser.user.id}`);
        }
      } catch (roleErr) {
        console.error('Exception adding admin role:', roleErr);
      }
    }

    // Log the user creation event
    try {
      await supabase.rpc('log_auth_event', {
        p_user_id: newUser.user?.id || null,
        p_email: email,
        p_event_type: 'admin_created_user',
        p_success: true
      });
    } catch (logErr) {
      console.error('Error logging auth event:', logErr);
      // Don't fail the request for logging errors
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.user?.id,
          email: newUser.user?.email,
          created_at: newUser.user?.created_at,
        },
        message: `User ${email} created successfully${isAdmin ? ' with admin privileges' : ''}`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in create-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);