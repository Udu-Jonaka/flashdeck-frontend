import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@flashdeck_theme";

const lightColors = {
  background: "#F9FAFB",
  surface: "#FFFFFF",
  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  primary: "#2A9D8F",
  primaryLight: "#DEF7EC",
  primaryDark: "#03543F",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  inputBg: "#FFFFFF",
  cardShadow: "#000",
  badgeEasy: { bg: "#DEF7EC", text: "#03543F" },
  badgeMedium: { bg: "#FEF08A", text: "#713F12" },
  badgeHard: { bg: "#FDE8E8", text: "#9B1C1C" },
  badgeDefault: { bg: "#F3F4F6", text: "#374151" },
  statusBar: "dark",
};

const darkColors = {
  background: "#0F172A",
  surface: "#1E293B",
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  border: "#334155",
  borderLight: "#1E293B",
  primary: "#2DD4BF",
  primaryLight: "#134E4A",
  primaryDark: "#99F6E4",
  danger: "#F87171",
  dangerLight: "#450A0A",
  inputBg: "#1E293B",
  cardShadow: "#000",
  badgeEasy: { bg: "#134E4A", text: "#99F6E4" },
  badgeMedium: { bg: "#422006", text: "#FDE68A" },
  badgeHard: { bg: "#450A0A", text: "#FCA5A5" },
  badgeDefault: { bg: "#334155", text: "#CBD5E1" },
  statusBar: "light",
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved) {
        setThemePreference(saved);
      }
    } catch (error) {
      if (__DEV__) console.log("Failed to load theme:", error.message);
    } finally {
      setIsReady(true);
    }
  };

  const setTheme = async (value) => {
    setThemePreference(value);
    try {
      await AsyncStorage.setItem(THEME_KEY, value);
    } catch (error) {
      if (__DEV__) console.log("Failed to save theme:", error.message);
    }
  };

  // Resolve the actual mode
  const resolvedMode =
    themePreference === "system"
      ? systemScheme || "light"
      : themePreference;

  const isDark = resolvedMode === "dark";
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{ colors, isDark, themePreference, setTheme, isReady }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
