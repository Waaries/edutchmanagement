
// Analytics configuration and constants
export const GA_MEASUREMENT_ID = 'G-5X70ML3RM6';

export const isProduction = () => {
  return window.location.hostname === 'edutchmanagement.nl' || 
         window.location.hostname === 'www.edutchmanagement.nl';
};

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
