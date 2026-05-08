import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";
import { styles } from "../styles/login.styles";

export default function VerifyScreen({ route, navigation }) {
  const { email } = route.params;
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // New State for the Timer
  const [timeLeft, setTimeLeft] = useState(15);
  const [canResend, setCanResend] = useState(false);

  // The Countdown Timer Logic
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true); // Enable the button when timer hits 0
    }

    // Cleanup the timer when component unmounts
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerify = async () => {
    if (pin.length !== 5) return Alert.alert("Error", "PIN must be 5 digits");

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      const response = await api.post("/auth/verify-email", {
        email: cleanEmail,
        pin: pin,
      });

      await SecureStore.setItemAsync("userToken", response.data.token);

      // Navigate to Dashboard and prevent going back!
      navigation.replace("Dashboard");
    } catch (error) {
      if (__DEV__) console.log("Backend Error Response:", error.response?.data);
      const message = error.response?.data?.message || "Verification failed";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendPin = async () => {
    // 1. Reset the timer and disable the button immediately
    setCanResend(false);
    setTimeLeft(15);

    try {
      const cleanEmail = email.trim().toLowerCase();
      // 2. Call your backend to generate and send a new PIN
      await api.post("/auth/resend-pin", { email: cleanEmail });
      Alert.alert("Sent!", "A new PIN has been sent to your email.");
    } catch (error) {
      Alert.alert("Error", "Could not resend PIN. Please try again.");
      // If it fails, let them try again immediately
      setCanResend(true);
      setTimeLeft(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We sent a 5-digit PIN to {email}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Verification PIN</Text>
            <TextInput
              style={[
                styles.input,
                { fontSize: 24, letterSpacing: 8, textAlign: "center" },
              ]}
              placeholder="00000"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={5}
              value={pin}
              onChangeText={setPin}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify Account</Text>
              )}
            </TouchableOpacity>

            {/* The New Resend Timer UI */}
            <View style={styles.resendContainer}>
              {canResend ? (
                <TouchableOpacity onPress={handleResendPin}>
                  <Text style={styles.resendTextActive}>Resend PIN</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTextInactive}>
                  Resend PIN in {timeLeft}s
                </Text>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
