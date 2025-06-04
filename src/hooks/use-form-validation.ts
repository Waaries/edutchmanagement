
import { useState, useCallback } from "react";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = <T extends Record<string, any>>(rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: string, value: string): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    if (rule.required && !value.trim()) {
      return "Dit veld is verplicht";
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `Minimaal ${rule.minLength} karakters vereist`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `Maximaal ${rule.maxLength} karakters toegestaan`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      if (name === "email") {
        return "Voer een geldig e-mailadres in";
      }
      if (name === "phone") {
        return "Voer een geldig telefoonnummer in";
      }
      return "Ongeldige invoer";
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((formData: T) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const fieldValue = String(formData[fieldName as keyof T] || "");
      const error = validateField(fieldName, fieldValue);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    setFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
};
