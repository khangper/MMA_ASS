import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // You can choose a different icon set if preferred

export default function LittleLemonFooter() {
  return (
    <View style={styles.footerContainer}>
      <Icon name="envelope" size={20} color="black" style={styles.icon} />
      <Text style={styles.emailText}>doananhkhang03@gmail.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "orange",
    marginBottom: 10,
    paddingVertical: 15, // Add vertical padding for a balanced look
    flexDirection: "row", // Align icon and text horizontally
    justifyContent: "center", // Center align both items
    alignItems: "center", // Center vertically
  },
  icon: {
    marginRight: 8, // Space between icon and text
  },
  emailText: {
    fontSize: 18,
    color: "yellow",
    textAlign: "center",
    fontWeight: "bold", // Make the text bold for emphasis
  },
});
