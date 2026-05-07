import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/preferences.styles";
import { useTheme } from "../context/ThemeContext";

const THEME_OPTIONS = [
  { id: "light", label: "Light Mode", icon: "sunny-outline" },
  { id: "dark", label: "Dark Mode", icon: "moon-outline" },
  { id: "system", label: "System Default", icon: "phone-portrait-outline" },
];

export default function PreferencesScreen({ navigation }) {
  const { colors, themePreference, setTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Preferences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Appearance</Text>
        </View>

        {/* Theme Options Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          {THEME_OPTIONS.map((option, index) => {
            const isActive = themePreference === option.id;
            const isLast = index === THEME_OPTIONS.length - 1;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.row,
                  { borderBottomColor: colors.borderLight },
                  isLast && styles.rowLast,
                ]}
                activeOpacity={0.6}
                onPress={() => setTheme(option.id)}
              >
                <View
                  style={[
                    styles.rowIconContainer,
                    { backgroundColor: colors.borderLight },
                    isActive && { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={18}
                    color={isActive ? colors.primaryDark : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.rowLabel,
                    { color: colors.text },
                    isActive && { color: colors.primaryDark },
                  ]}
                >
                  {option.label}
                </Text>
                {isActive && (
                  <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Footnote */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            "System Default" will follow your device's current appearance
            setting. Changes are applied immediately.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
