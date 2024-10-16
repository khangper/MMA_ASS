import * as React from "react";
import { View, Image, Text, StyleSheet, Button } from "react-native";

export default function LittleLemonBody({ navigation }) {
  return (
    <View style={{ padding: 20, backgroundColor: "#495E57", flex: 1 }}>
      <View style={styles.flex}>
        <Image
          source={require("../components/Lemon.png")}
          style={styles.image}
        />

        <Text style={styles.title} numberOfLines={3}>
          Little Lemon
        </Text>
      </View>

      <Text style={{ fontSize: 20, color: "white" }} numberOfLines={5}>
        Little Lemon is a charming neighborhood bistro that serves simple food
        and classic cocktails in a lively but casual environment. We would love
        to hear more about your experience with us!
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Login"
          onPress={() => navigation.navigate("LoginScreen")}
          color="#f194ff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    color: "white",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: "#f194ff",
    borderRadius: 10,
    padding: 10,
  },
});
