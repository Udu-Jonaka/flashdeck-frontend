import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { styles } from "../styles/profile.styles";

export default function ProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({ decks: 0, cards: 0 });

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
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
      console.log("Fetch Profile Error:", error.message);
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
            // 1. Destroy the secure token
            await SecureStore.deleteItemAsync("userToken");
            // 2. Route them entirely out of the app stack back to Login
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
        style={[styles.menuItem, isDestructive && styles.logoutItem]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.menuIconContainer,
            isDestructive && styles.logoutIconContainer,
          ]}
        >
          <IconComponent
            name={icon}
            size={20}
            color={isDestructive ? "#EF4444" : "#6B7280"}
          />
        </View>
        <Text style={[styles.menuText, isDestructive && styles.logoutText]}>
          {title}
        </Text>
        {!isDestructive && (
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Identity & Stats Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userProfile?.profile?.username?.charAt(0).toUpperCase() || "S"}</Text>
          </View>
          <Text style={styles.name}>{userProfile?.profile?.username || "Student"}</Text>
          <Text style={styles.email}>{userProfile?.email || "loading..."}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.decks}</Text>
              <Text style={styles.statLabel}>Decks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.cards}</Text>
              <Text style={styles.statLabel}>Cards</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>🔥 {userProfile?.streakCount || 1}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          {renderMenuItem("person-outline", "Ionicons", "Edit Profile", () =>
            console.log("Go to Edit Profile"),
          )}
          {renderMenuItem("cog-outline", "Ionicons", "Preferences", () =>
            console.log("Go to Preferences"),
          )}
          {renderMenuItem("star-outline", "Ionicons", "Upgrade to Pro", () =>
            console.log("Go to Pro"),
          )}
          {renderMenuItem(
            "help-circle-outline",
            "Ionicons",
            "Help & Support",
            () => console.log("Go to Support"),
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
