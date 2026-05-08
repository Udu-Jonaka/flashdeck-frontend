import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as SecureStore from "expo-secure-store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../services/api";
import { styles } from "../styles/createDeck.styles";
import { useTheme } from "../context/ThemeContext";

export default function CreateDeckScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [topic, setTopic] = useState("");
  const [material, setMaterial] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  // Document Picker Logic
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "text/plain",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setMaterial("");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  // The AI Generation API Call
  const handleGenerate = async () => {
    if (!topic) return Alert.alert("Error", "Please enter a topic");
    if (!material && !selectedFile)
      return Alert.alert("Error", "Please provide notes or a document");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("difficulty", difficulty);
      formData.append("amount", amount.toString());

      if (selectedFile) {
        formData.append("file", {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/pdf",
        });
      } else {
        formData.append("text", material);
      }

      const token = await SecureStore.getItemAsync("userToken");

      const fetchResponse = await fetch(
        `${api.defaults.baseURL}/decks/generate`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseData = await fetchResponse.json();

      if (!fetchResponse.ok) {
        throw new Error(
          responseData.message || "Failed to generate flashcards.",
        );
      }

      navigation.goBack();
    } catch (error) {
      console.error("Generation Error:", error.message);
      Alert.alert("Generation Failed");
    } finally {
      setLoading(false);
    }
  };

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
          Create New Deck
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Topic
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="e.g. Quantum Physics"
            placeholderTextColor={colors.textMuted}
            value={topic}
            onChangeText={setTopic}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            How do you want to provide content?
          </Text>

          {/* Document Upload Area */}
          {!selectedFile ? (
            <TouchableOpacity
              style={[
                styles.uploadContainer,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={pickDocument}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={32}
                color={colors.primary}
              />
              <Text
                style={[styles.uploadText, { color: colors.textSecondary }]}
              >
                Upload PDF, DOCX, or TXT File
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.fileInfo,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Ionicons
                name="document-text"
                size={24}
                color={colors.primaryDark}
              />
              <Text
                style={[styles.fileName, { color: colors.primaryDark }]}
                numberOfLines={1}
              >
                {selectedFile.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedFile(null)}>
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={colors.primaryDark}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Visual Divider */}
          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              OR PASTE TEXT
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.border }]}
            />
          </View>

          {/* Text Area */}
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
              selectedFile && { opacity: 0.5 },
            ]}
            placeholder={
              selectedFile
                ? "Using uploaded document..."
                : "Paste notes here..."
            }
            placeholderTextColor={colors.textMuted}
            multiline
            value={material}
            onChangeText={setMaterial}
            editable={!selectedFile}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Difficulty
          </Text>
          <View style={styles.difficultyRow}>
            {["Easy", "Medium", "Hard"].map((level) => {
              const isActive = difficulty === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyBtn,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    isActive && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: colors.textSecondary },
                      isActive && { color: "#FFFFFF" },
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Number of Cards
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor:
                  amount <= 5 ? colors.borderLight : colors.border,
                borderRadius: 10,
                width: 50,
                alignItems: "center",
              }}
              onPress={() => setAmount((prev) => Math.max(5, prev - 1))}
              disabled={amount <= 5}
            >
              <Ionicons
                name="remove"
                size={24}
                color={amount <= 5 ? colors.textMuted : colors.text}
              />
            </TouchableOpacity>

            <View style={{ width: 60, alignItems: "center" }}>
              <Text
                style={{ fontSize: 24, fontWeight: "700", color: colors.text }}
              >
                {amount}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor:
                  amount >= 40 ? colors.borderLight : colors.border,
                borderRadius: 10,
                width: 50,
                alignItems: "center",
              }}
              onPress={() => setAmount((prev) => Math.min(40, prev + 1))}
              disabled={amount >= 40}
            >
              <Ionicons
                name="add"
                size={24}
                color={amount >= 40 ? colors.textMuted : colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateBtn, { backgroundColor: colors.primary }]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.generateBtnText}>Generate Deck</Text>
                <MaterialCommunityIcons
                  name="auto-fix"
                  size={22}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
