import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Change the icon set if needed

export default function LittleLemonHeader() {
  return (
    <View style={styles.headerContainer}>
      <Icon name="paint-brush" size={30} color="#ff6347" style={styles.icon} />
      <Text style={styles.header}>Haha Shope</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderBottomWidth: 2,
    borderColor: "#ff6347",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center vertically
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#ff6347",
    textShadowColor: "#aaa",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});
