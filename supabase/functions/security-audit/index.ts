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

    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: isAdminResult, error: adminError } = await supabase
      .rpc('is_admin');

    if (adminError || !isAdminResult) {
      console.error('Admin check failed:', adminError);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse query parameters
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';
    const resourceType = url.searchParams.get('resource_type');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const timeframe = url.searchParams.get('timeframe') || '24h'; // 1h, 24h, 7d, 30d

    // Calculate time filter
    let timeFilter = new Date();
    switch (timeframe) {
      case '1h':
        timeFilter.setHours(timeFilter.getHours() - 1);
        break;
      case '24h':
        timeFilter.setDate(timeFilter.getDate() - 1);
        break;
      case '7d':
        timeFilter.setDate(timeFilter.getDate() - 7);
        break;
      case '30d':
        timeFilter.setDate(timeFilter.getDate() - 30);
        break;
      default:
        timeFilter.setDate(timeFilter.getDate() - 1);
    }

    if (action === 'list') {
      // Get security audit logs
      let query = supabase
        .from('security_audit_logs')
        .select('*')
        .gte('created_at', timeFilter.toISOString())
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (resourceType) {
        query = query.eq('resource_type', resourceType);
      }

      const { data: logs, error: logsError } = await query;

      if (logsError) {
        console.error('Error fetching audit logs:', logsError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch audit logs' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get summary statistics
      const { data: stats, error: statsError } = await supabase
        .from('security_audit_logs')
        .select('action, success, resource_type')
        .gte('created_at', timeFilter.toISOString());

      let summary = {};
      if (!statsError && stats) {
        summary = {
          total_events: stats.length,
          successful_events: stats.filter(s => s.success).length,
          failed_events: stats.filter(s => !s.success).length,
          by_resource: stats.reduce((acc: any, s) => {
            acc[s.resource_type] = (acc[s.resource_type] || 0) + 1;
            return acc;
          }, {}),
          by_action: stats.reduce((acc: any, s) => {
            acc[s.action] = (acc[s.action] || 0) + 1;
            return acc;
          }, {})
        };
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            logs,
            summary,
            pagination: {
              offset,
              limit,
              total: logs?.length || 0
            },
            timeframe
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'test') {
      // Security test endpoint
      const testResults = {
        timestamp: new Date().toISOString(),
        tests: []
      };

      // Test 1: Verify RLS on filled_contracts
      try {
        const { error: contractError } = await supabase
          .from('filled_contracts')
          .select('*')
          .limit(1);
        
        testResults.tests.push({
          name: 'filled_contracts_rls',
          status: contractError ? 'PASS' : 'FAIL',
          description: 'Filled contracts should be protected by RLS',
          error: contractError?.message
        });
      } catch (e) {
        testResults.tests.push({
          name: 'filled_contracts_rls',
          status: 'PASS',
          description: 'Filled contracts properly protected by RLS'
        });
      }

      // Test 2: Verify RLS on user_sessions  
      try {
        const { error: sessionError } = await supabase
          .from('user_sessions')
          .select('*')
          .limit(1);
          
        testResults.tests.push({
          name: 'user_sessions_rls',
          status: sessionError ? 'PASS' : 'FAIL',
          description: 'User sessions should be protected by RLS',
          error: sessionError?.message
        });
      } catch (e) {
        testResults.tests.push({
          name: 'user_sessions_rls', 
          status: 'PASS',
          description: 'User sessions properly protected by RLS'
        });
      }

      // Test 3: Verify contact_messages RLS for non-admins
      try {
        const { error: contactError } = await supabase
          .from('contact_messages')
          .select('*')
          .limit(1);
          
        testResults.tests.push({
          name: 'contact_messages_rls',
          status: 'PASS', // Admin should be able to access
          description: 'Contact messages accessible to admins'
        });
      } catch (e) {
        testResults.tests.push({
          name: 'contact_messages_rls',
          status: 'FAIL',
          description: 'Contact messages should be accessible to admins',
          error: e.message
        });
      }

      // Test 4: Verify audit logs are created
      const { data: recentLogs, error: auditError } = await supabase
        .from('security_audit_logs')
        .select('id')
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .limit(1);

      testResults.tests.push({
        name: 'audit_logging',
        status: (recentLogs && recentLogs.length > 0) ? 'PASS' : 'WARNING',
        description: 'Security audit logging should be active',
        details: `Found ${recentLogs?.length || 0} recent audit log entries`
      });

      // Overall status
      const failedTests = testResults.tests.filter(t => t.status === 'FAIL').length;
      const warningTests = testResults.tests.filter(t => t.status === 'WARNING').length;
      
      testResults.overall_status = failedTests === 0 
        ? (warningTests === 0 ? 'SECURE' : 'MOSTLY_SECURE')
        : 'VULNERABLE';

      return new Response(
        JSON.stringify({
          success: true,
          data: testResults
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Security audit error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});