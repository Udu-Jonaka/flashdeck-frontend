import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { styles } from "../styles/editProfile.styles";
import { useTheme } from "../context/ThemeContext";

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchCurrentProfile();
    }, []),
  );

  const fetchCurrentProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      const name = response.data.user?.profile?.username || "";
      setUsername(name);
      setOriginalUsername(name);
    } catch (error) {
      if (__DEV__) console.log("Fetch Profile Error:", error.message);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      return Alert.alert("Error", "Username cannot be empty.");
    }

    if (username.trim() === originalUsername) {
      return navigation.goBack();
    }

    setLoading(true);
    try {
      await api.patch("/auth/profile", { username: username.trim() });

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initial = username ? username.charAt(0).toUpperCase() : "S";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Edit Profile
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Avatar Section */}
        <View
          style={[
            styles.avatarSection,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.borderLight,
            },
          ]}
        >
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.primaryDark }]}>
              {initial}
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Username
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
              isFocused && { borderColor: colors.primary, borderWidth: 2 },
            ]}
            placeholder="Enter your username"
            placeholderTextColor={colors.textMuted}
            value={username}
            onChangeText={setUsername}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            loading && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
