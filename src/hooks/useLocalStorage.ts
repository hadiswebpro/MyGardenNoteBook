import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  initial: () => T,
  isValid?: (value: unknown) => value is T
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initial();
    }

    try {
      const storedValue = window.localStorage.getItem(key);

      if (storedValue !== null) {
        const parsed: unknown = JSON.parse(storedValue);

        if (!isValid || isValid(parsed)) {
          return parsed as T;
        }
      }
    } catch (error) {
      console.error("Failed to read localStorage:", error);
    }

    return initial();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
