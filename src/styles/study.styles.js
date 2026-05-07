import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 50 : 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 16,
    flex: 1,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // The actual animated wrapper
  flipWrapper: {
    width: cardWidth,
    height: cardWidth * 1.4,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    // Absolute position so front and back stack on top of each other
    position: "absolute",
    backfaceVisibility: "hidden", // MAGIC: Hides the mirror image when flipped
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardBack: {
    backgroundColor: "#DEF7EC", // Soft Sea Green for the answer side
    borderColor: "#A7F3D0",
  },
  cardLabel: {
    position: "absolute",
    top: 20,
    left: 20,
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 34,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonActive: {
    backgroundColor: "#2A9D8F",
    shadowColor: "#2A9D8F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  flipButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: "#111827",
  },
  flipButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
