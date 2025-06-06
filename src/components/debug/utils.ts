
export const getStatusColor = (status: string) => {
  if (status === 'SUBSCRIBED') {
    return 'text-green-500';
  }
  
  const errorStates = ['TIMED_OUT', 'CLOSED', 'CHANNEL_ERROR'];
  
  if (errorStates.includes(status)) {
    return 'text-red-500';
  }
  
  return 'text-yellow-500';
};
