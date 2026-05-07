import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../services/api";
import { styles } from "../styles/dashboard.styles";

export default function DashboardScreen({ navigation }) {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Student");

  useFocusEffect(
    useCallback(() => {
      fetchDecks();
      fetchProfile();
    }, []),
  );

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      if (res.data?.user?.profile?.username) {
        setUsername(res.data.user.profile.username);
      }
    } catch (error) {
      console.log("Fetch Profile Error:", error.message);
    }
  };

  const fetchDecks = async () => {
    try {
      const response = await api.get("/decks");
      // The backend returns { count, decks } for getAllDecks, or just an array for getUserDecks
      setDecks(response.data.decks || response.data);
    } catch (error) {
      console.log("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deckId) => {
    Alert.alert(
      "Delete Deck",
      "Are you sure you want to delete this study deck?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/decks/${deckId}`);
              setDecks((prev) =>
                prev.filter((d) => d._id !== deckId && d.id !== deckId),
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Could not delete the deck. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const getBadgeStyle = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return { bg: "#DEF7EC", text: "#03543F" };
      case "Medium":
        return { bg: "#FEF08A", text: "#713F12" };
      case "Hard":
        return { bg: "#FDE8E8", text: "#9B1C1C" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="cards-playing-outline"
        size={100}
        color="#E5E7EB"
      />
      <Text style={styles.emptyTitle}>No Decks Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your library is empty. Tap the green button below to generate your first
        AI study deck!
      </Text>
    </View>
  );

  const renderDeckCard = ({ item }) => {
    const badge = getBadgeStyle(item.difficulty || "Medium");
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("StudyDeck", { deck: item })}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Text style={[styles.cardTitle, { flex: 1, paddingRight: 10 }]}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={{ padding: 4 }}
            onPress={() => handleDelete(item._id || item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardFooter}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="cards-outline"
              size={18}
              color="#6B7280"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.cardCount}>
              {item.cards?.length || 0} Cards
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>
              {item.difficulty || "New"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.title}>{username} 🚀</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={38} color="#2A9D8F" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#2A9D8F" />
        </View>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderDeckCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchDecks}
          refreshing={loading}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("CreateDeck")}
      >
        <Ionicons name="add" size={38} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
