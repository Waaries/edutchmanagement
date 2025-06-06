
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

export const getStatusColor = (status: string) => {
  if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
    return 'text-green-500';
  }
  
  const errorStates = [
    REALTIME_SUBSCRIBE_STATES.TIMED_OUT, 
    REALTIME_SUBSCRIBE_STATES.CLOSED, 
    REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR
  ];
  
  if (errorStates.includes(status as any)) {
    return 'text-red-500';
  }
  
  return 'text-yellow-500';
};
