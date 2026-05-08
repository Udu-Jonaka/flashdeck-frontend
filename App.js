import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator, Image, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import api from "./src/services/api";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import VerifyScreen from "./src/screens/VerifyScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import CreateDeckScreen from "./src/screens/CreateDeckScreen";
import StudyScreen from "./src/screens/StudyScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import PreferencesScreen from "./src/screens/PreferencesScreen";

const Stack = createNativeStackNavigator();

function MainApp() {
  const { colors, isReady: themeReady } = useTheme();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        setInitialRoute("Welcome");
        return;
      }

      // Verify token with backend
      await api.get("/auth/profile");
      setInitialRoute("Dashboard");
    } catch (error) {
      // If token is invalid/expired
      await SecureStore.deleteItemAsync("userToken");
      setInitialRoute("Welcome");
    }
  };

  if (!themeReady || initialRoute === null) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: colors.background }]}>
        <Image
          source={require("./assets/splash-icon.png")}
          style={styles.splashImage}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="CreateDeck" component={CreateDeckScreen} />
        <Stack.Screen name="StudyDeck" component={StudyScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  spinner: {
    position: "absolute",
    bottom: 100,
  },
});
