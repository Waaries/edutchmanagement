
import { useEffect, useRef } from "react";
import { devLog } from "@/lib/logger";

interface UseAutoSaveProps {
  data: any;
  key: string;
  delay?: number;
}

export const useAutoSave = ({ data, key, delay = 2000 }: UseAutoSaveProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`autosave_${key}`, JSON.stringify(data));
        devLog(`Auto-saved form data for ${key}`);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, delay]);

  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(`autosave_${key}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to load saved data:", error);
      return null;
    }
  };

  const clearSavedData = () => {
    try {
      localStorage.removeItem(`autosave_${key}`);
    } catch (error) {
      console.error("Failed to clear saved data:", error);
    }
  };

  return { loadSavedData, clearSavedData };
};
