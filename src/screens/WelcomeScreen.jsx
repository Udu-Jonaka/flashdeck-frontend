import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";

// Import your separated styles!
import { styles } from "../styles/welcome.styles";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>
          FLASH<Text style={styles.logoAccent}>DECK</Text>
        </Text>
        <Text style={styles.title}>Welcome to{"\n"}FLASHDECK!</Text>
        <Text style={styles.subtitle}>
          Your AI-powered study assistant for effortless flashcard generation.
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/welcome-img.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.primaryButtonText}>Signup</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
