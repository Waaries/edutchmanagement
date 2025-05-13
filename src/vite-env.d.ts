
/// <reference types="vite/client" />

declare namespace Supabase {
  interface Auth {
    admin: {
      listUsers: () => Promise<{ data: { users: any[] }, error: any }>;
      getUserById: (id: string) => Promise<{ data: { user: any }, error: any }>;
    }
  }
}

declare module '@supabase/supabase-js' {
  interface SupabaseAuthClient extends Supabase.Auth {}
}
