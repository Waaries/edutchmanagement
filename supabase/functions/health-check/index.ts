
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const healthCheck = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        database: { status: 'unknown', responseTime: 0 },
        auth: { status: 'unknown', responseTime: 0 },
        storage: { status: 'unknown', responseTime: 0 }
      },
      system: {
        uptime: performance.now(),
        memory: Deno.memoryUsage?.() || null
      }
    };

    // Test database connection
    const dbStart = performance.now();
    try {
      const { error: dbError } = await supabase.from('profiles').select('count').limit(1);
      const dbTime = performance.now() - dbStart;
      
      healthCheck.services.database = {
        status: dbError ? 'error' : 'healthy',
        responseTime: Math.round(dbTime),
        error: dbError?.message
      };
    } catch (error) {
      healthCheck.services.database = {
        status: 'error',
        responseTime: performance.now() - dbStart,
        error: error.message
      };
    }

    // Test auth service
    const authStart = performance.now();
    try {
      const { error: authError } = await supabase.auth.getSession();
      const authTime = performance.now() - authStart;
      
      healthCheck.services.auth = {
        status: authError ? 'error' : 'healthy',
        responseTime: Math.round(authTime),
        error: authError?.message
      };
    } catch (error) {
      healthCheck.services.auth = {
        status: 'error',
        responseTime: performance.now() - authStart,
        error: error.message
      };
    }

    // Test storage service
    const storageStart = performance.now();
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      const storageTime = performance.now() - storageStart;
      
      healthCheck.services.storage = {
        status: storageError ? 'error' : 'healthy',
        responseTime: Math.round(storageTime),
        error: storageError?.message
      };
    } catch (error) {
      healthCheck.services.storage = {
        status: 'error',
        responseTime: performance.now() - storageStart,
        error: error.message
      };
    }

    // Overall health status
    const hasErrors = Object.values(healthCheck.services).some(service => service.status === 'error');
    healthCheck.status = hasErrors ? 'degraded' : 'healthy';

    console.log('[Health Check]', JSON.stringify(healthCheck, null, 2));

    return new Response(
      JSON.stringify(healthCheck),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: hasErrors ? 503 : 200
      }
    );

  } catch (error) {
    console.error('[Health Check] Critical error:', error);
    
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
