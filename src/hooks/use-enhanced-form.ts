
import { useState, useCallback, useRef } from 'react';

interface UseEnhancedFormOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
}

interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export const useEnhancedForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Partial<Record<keyof T, string>>,
  options: UseEnhancedFormOptions = {}
) => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    resetOnSubmit = false
  } = options;

  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => 
    Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: initialValues[key as keyof T] || '',
        error: undefined,
        touched: false
      }
    }), {} as Record<keyof T, FormField>)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitAttempted = useRef(false);

  const validateField = useCallback((name: keyof T, value: string) => {
    if (!validationSchema) return undefined;
    
    const currentValues = Object.keys(fields).reduce((acc, key) => ({
      ...acc,
      [key]: key === name ? value : fields[key as keyof T].value
    }), {} as T);
    
    const errors = validationSchema(currentValues);
    return errors[name];
  }, [fields, validationSchema]);

  const validateForm = useCallback(() => {
    if (!validationSchema) return {};
    
    const values = Object.keys(fields).reduce((acc, key) => ({
      ...acc,
      [key]: fields[key as keyof T].value
    }), {} as T);
    
    return validationSchema(values);
  }, [fields, validationSchema]);

  const setFieldValue = useCallback((name: keyof T, value: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: validateOnChange ? validateField(name, value) : prev[name].error
      }
    }));
  }, [validateOnChange, validateField]);

  const setFieldTouched = useCallback((name: keyof T, touched: boolean = true) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched,
        error: (touched && validateOnBlur) ? validateField(name, prev[name].value) : prev[name].error
      }
    }));
  }, [validateOnBlur, validateField]);

  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    submitAttempted.current = true;
    setIsSubmitting(true);

    // Validate all fields
    const errors = validateForm();
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      // Mark all fields as touched and set errors
      setFields(prev => 
        Object.keys(prev).reduce((acc, key) => ({
          ...acc,
          [key]: {
            ...prev[key as keyof T],
            touched: true,
            error: errors[key as keyof T] || prev[key as keyof T].error
          }
        }), {} as Record<keyof T, FormField>)
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const values = Object.keys(fields).reduce((acc, key) => ({
        ...acc,
        [key]: fields[key as keyof T].value
      }), {} as T);

      await onSubmit(values);

      if (resetOnSubmit) {
        setFields(Object.keys(initialValues).reduce((acc, key) => ({
          ...acc,
          [key]: {
            value: initialValues[key as keyof T] || '',
            error: undefined,
            touched: false
          }
        }), {} as Record<keyof T, FormField>));
        submitAttempted.current = false;
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [fields, validateForm, resetOnSubmit, initialValues]);

  const reset = useCallback(() => {
    setFields(Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: initialValues[key as keyof T] || '',
        error: undefined,
        touched: false
      }
    }), {} as Record<keyof T, FormField>));
    submitAttempted.current = false;
  }, [initialValues]);

  const values = Object.keys(fields).reduce((acc, key) => ({
    ...acc,
    [key]: fields[key as keyof T].value
  }), {} as T);

  const errors = Object.keys(fields).reduce((acc, key) => ({
    ...acc,
    [key]: fields[key as keyof T].error
  }), {} as Partial<Record<keyof T, string>>);

  const touched = Object.keys(fields).reduce((acc, key) => ({
    ...acc,
    [key]: fields[key as keyof T].touched
  }), {} as Record<keyof T, boolean>);

  const isValid = Object.keys(errors).every(key => !errors[key as keyof T]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    submitAttempted: submitAttempted.current,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    reset,
    validateForm
  };
};
