
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { monitoring, trackUserExperience } from '@/lib/monitoring';

export const useMonitoring = () => {
  const { user } = useAuth();
  const mountTime = useRef<number>(Date.now());

  useEffect(() => {
    // Set user ID for monitoring when user changes
    if (user?.id) {
      monitoring.setUserId(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    // Track component mount
    const componentName = 'useMonitoring';
    trackUserExperience('component_mount', undefined, { component: componentName });

    return () => {
      // Track component unmount and session duration
      const sessionDuration = Date.now() - mountTime.current;
      trackUserExperience('component_unmount', sessionDuration, { component: componentName });
    };
  }, []);

  return {
    reportError: monitoring.reportError.bind(monitoring),
    reportPerformance: monitoring.reportPerformance.bind(monitoring),
    trackUserExperience: monitoring.trackUserExperience.bind(monitoring),
    startTimer: monitoring.startTimer.bind(monitoring),
    getLocalData: monitoring.getLocalData.bind(monitoring),
    clearLocalData: monitoring.clearLocalData.bind(monitoring)
  };
};

// Hook for tracking page visits
export const usePageTracking = (pageName: string) => {
  const pageLoadTime = useRef<number>(Date.now());

  useEffect(() => {
    // Track page visit
    trackUserExperience('page_visit', undefined, { page: pageName });

    // Track page load time
    const timer = setTimeout(() => {
      const loadTime = Date.now() - pageLoadTime.current;
      trackUserExperience('page_load_complete', loadTime, { page: pageName });
    }, 100);

    return () => {
      clearTimeout(timer);
      // Track page leave
      const timeOnPage = Date.now() - pageLoadTime.current;
      trackUserExperience('page_leave', timeOnPage, { page: pageName });
    };
  }, [pageName]);
};

// Hook for tracking form interactions
export const useFormTracking = (formName: string) => {
  const formStartTime = useRef<number | null>(null);

  const trackFormStart = () => {
    formStartTime.current = Date.now();
    trackUserExperience('form_start', undefined, { form: formName });
  };

  const trackFormSubmit = (success: boolean, errors?: string[]) => {
    const duration = formStartTime.current ? Date.now() - formStartTime.current : undefined;
    trackUserExperience('form_submit', duration, { 
      form: formName, 
      success,
      errors: errors?.join(', ')
    });
  };

  const trackFormError = (error: string) => {
    trackUserExperience('form_error', undefined, { form: formName, error });
  };

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError
  };
};
