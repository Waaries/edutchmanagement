-- Fix security issue: Move pgjwt extension to extensions schema
DROP EXTENSION IF EXISTS pgjwt;
CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;