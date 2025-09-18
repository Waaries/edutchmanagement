-- Enable all recommended extensions for business address/contract management system

-- Core automation extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Text processing extensions
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;

-- Data storage extensions
CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA extensions;

-- Geographic extensions (for address management)
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- AI/Vector extensions (for advanced search)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Performance monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_monitor WITH SCHEMA extensions;