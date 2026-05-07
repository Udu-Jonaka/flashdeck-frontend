import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 40,
    color: "#333333",
  },
  logoAccent: {
    color: "#2A9D8F", // Aesthetic Sea Green
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroImage: {
    width: "100%",
    height: 280,
    borderRadius: 30,
  },
  actionContainer: {
    marginBottom: 40,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#2A9D8F", // Aesthetic Sea Green
    fontSize: 14,
    fontWeight: "600",
  },
});
