import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../services/api"; // Make sure this path points to your interceptor API file
import { styles } from "../styles/createDeck.styles";

export default function CreateDeckScreen({ navigation }) {
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
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ], // Limits to PDF, TXT, and DOCX
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setMaterial(""); // Clear text if a file is chosen to avoid sending both
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
      // 1. Prepare the multipart payload
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

      // 2. Send to the backend
      const response = await api.post("/decks/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success! Deck generated:", response.data);

      // 3. Navigate back to the Dashboard on success
      navigation.goBack();
    } catch (error) {
      console.log("Generation Error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to generate flashcards.";
      Alert.alert("Generation Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Deck</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Topic</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Quantum Physics"
            value={topic}
            onChangeText={setTopic}
          />

          <Text style={styles.label}>How do you want to provide content?</Text>

          {/* Document Upload Area */}
          {!selectedFile ? (
            <TouchableOpacity
              style={styles.uploadContainer}
              onPress={pickDocument}
            >
              <Ionicons name="cloud-upload-outline" size={32} color="#2A9D8F" />
              <Text style={styles.uploadText}>Upload PDF, DOCX, or TXT File</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileInfo}>
              <Ionicons name="document-text" size={24} color="#03543F" />
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedFile.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedFile(null)}>
                <Ionicons name="close-circle" size={24} color="#03543F" />
              </TouchableOpacity>
            </View>
          )}

          {/* Visual Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR PASTE TEXT</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Text Area */}
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              selectedFile && { opacity: 0.5 },
            ]}
            placeholder={
              selectedFile
                ? "Using uploaded document..."
                : "Paste notes here..."
            }
            multiline
            value={material}
            onChangeText={setMaterial}
            editable={!selectedFile} // Disable keyboard input if a file is already selected
          />

          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.difficultyRow}>
            {["Easy", "Medium", "Hard"].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyBtn,
                  difficulty === level && styles.activeDifficulty,
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    difficulty === level && styles.activeDifficultyText,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Number of Cards</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
            <TouchableOpacity 
              style={{ padding: 10, backgroundColor: amount <= 5 ? '#F3F4F6' : '#E5E7EB', borderRadius: 10, width: 50, alignItems: 'center' }}
              onPress={() => setAmount(prev => Math.max(5, prev - 1))}
              disabled={amount <= 5}
            >
              <Ionicons name="remove" size={24} color={amount <= 5 ? "#9CA3AF" : "#374151"} />
            </TouchableOpacity>
            
            <View style={{ width: 60, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{amount}</Text>
            </View>
            
            <TouchableOpacity 
              style={{ padding: 10, backgroundColor: amount >= 40 ? '#F3F4F6' : '#E5E7EB', borderRadius: 10, width: 50, alignItems: 'center' }}
              onPress={() => setAmount(prev => Math.min(40, prev + 1))}
              disabled={amount >= 40}
            >
              <Ionicons name="add" size={24} color={amount >= 40 ? "#9CA3AF" : "#374151"} />
            </TouchableOpacity>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={styles.generateBtn}
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
