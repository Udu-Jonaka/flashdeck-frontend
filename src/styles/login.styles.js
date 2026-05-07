import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  forgotPassword: {
    color: "#2A9D8F",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    marginTop: -8, // Pulls it slightly closer to the password input
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2A9D8F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },
  // ... your existing styles
  resendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resendTextActive: {
    color: "#2A9D8F", // Aesthetic Sea Green
    fontSize: 14,
    fontWeight: "600",
  },
  resendTextInactive: {
    color: "#9CA3AF", // Grayed out
    fontSize: 14,
    fontWeight: "500",
  },
});
