import * as React from "react";
import { ScrollView, Text, StyleSheet, TextInput, Button } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome to Little Lemon</Text>

      <TextInput
        style={styles.inputBox}
        placeholder={"First Name"}
        clearButtonMode={"always"}
      />
      <TextInput
        style={styles.inputBox}
        placeholder={"Password"}
        clearButtonMode={"always"}
      />
      <Button
        title="Go to Instructor"
        onPress={() => navigation.navigate("Instructor")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    padding: 40,
    fontSize: 30,
    color: "#EDEFEE",
    textAlign: "center",
  },
  regularText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: "#EDEFEE",
    textAlign: "center",
  },
  inputBox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
  },
});
