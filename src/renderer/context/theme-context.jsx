import { createContext, useContext, useEffect, useState } from "react";

export const themes = [
  { id: "main", name: "Main", primary: "#0ea5e9" },
  { id: "ocean", name: "Ocean", primary: "#0d9488" },
  { id: "forest", name: "Forest", primary: "#22c55e" },
  { id: "sunset", name: "Sunset", primary: "#ea580c" },
  { id: "royal", name: "Royal", primary: "#8b5cf6" },
  { id: "crimson", name: "Crimson", primary: "#dc2626" },
];

export const modes = [
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
];

const ThemeContext = createContext({
  theme: "main",
  mode: "light",
  setTheme: () => null,
  setMode: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "main",
  defaultMode = "light",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(`${storageKey}-theme`) || defaultTheme
  );
  const [mode, setMode] = useState(
    () => localStorage.getItem(`${storageKey}-mode`) || defaultMode
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(
      "main-light", "main-dark",
      "ocean-light", "ocean-dark",
      "forest-light", "forest-dark",
      "sunset-light", "sunset-dark",
      "royal-light", "royal-dark",
      "crimson-light", "crimson-dark"
    );

    root.classList.add(`${theme}-${mode}`);
    localStorage.setItem(`${storageKey}-theme`, theme);
    localStorage.setItem(`${storageKey}-mode`, mode);
  }, [theme, mode]);

  const value = {
    theme,
    mode,
    setTheme: (theme) => setTheme(theme),
    setMode: (mode) => setMode(mode),
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
