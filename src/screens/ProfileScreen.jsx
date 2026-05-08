import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { styles } from "../styles/profile.styles";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({ decks: 0, cards: 0 });

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, []),
  );

  const fetchProfileData = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUserProfile(response.data.user);
      setStats({
        decks: response.data.deckCount || 0,
        cards: response.data.cardCount || 0,
      });
    } catch (error) {
      if (__DEV__) console.log("Fetch Profile Error:", error.message);
    }
  };

  // The Logout Logic
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("userToken");
            navigation.replace("Login");
          } catch (error) {
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  // Helper for rendering menu items cleanly
  const renderMenuItem = (
    icon,
    iconLib,
    title,
    onPress,
    isDestructive = false,
  ) => {
    const IconComponent =
      iconLib === "Material" ? MaterialCommunityIcons : Ionicons;

    return (
      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: colors.surface }, isDestructive && styles.logoutItem]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.menuIconContainer,
            { backgroundColor: colors.borderLight },
            isDestructive && { backgroundColor: colors.dangerLight },
          ]}
        >
          <IconComponent
            name={icon}
            size={20}
            color={isDestructive ? colors.danger : colors.textSecondary}
          />
        </View>
        <Text style={[styles.menuText, { color: colors.text }, isDestructive && { color: colors.danger }]}>
          {title}
        </Text>
        {!isDestructive && (
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.statusBar} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Identity & Stats Section */}
        <View style={[styles.profileSection, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarText, { color: colors.primaryDark }]}>
              {userProfile?.profile?.username?.charAt(0).toUpperCase() || "S"}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>
            {userProfile?.profile?.username || "Student"}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {userProfile?.email || "loading..."}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.decks}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Decks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.cards}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cards</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                🔥 {userProfile?.streakCount || 1}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          {renderMenuItem("person-outline", "Ionicons", "Edit Profile", () =>
            navigation.navigate("EditProfile"),
          )}
          {renderMenuItem("cog-outline", "Ionicons", "Preferences", () =>
            navigation.navigate("Preferences"),
          )}
          {renderMenuItem("star-outline", "Ionicons", "Upgrade to Pro", () => {
            if (__DEV__) console.log("Go to Pro");
          })}
          {renderMenuItem(
            "help-circle-outline",
            "Ionicons",
            "Help & Support",
            () => { if (__DEV__) console.log("Go to Support"); },
          )}

          {/* Logout Button */}
          {renderMenuItem(
            "log-out-outline",
            "Ionicons",
            "Log Out",
            handleLogout,
            true,
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
