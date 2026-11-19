import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

type Theme = "dark" | "light";

function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

export default function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(
    "garden-theme",
    () => "light",
    isTheme
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setDark = (dark: boolean) => {
    setTheme(dark ? "dark" : "light");
  };

  return {
    dark: theme === "dark",
    setDark,
  };
}
