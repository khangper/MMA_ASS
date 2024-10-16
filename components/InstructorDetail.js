import * as React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import axios from "axios";

export default function InstructorDetail({ route }) {
  const { id } = route.params;
  const [instructor, setInstructor] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(`https://668dde68bf9912d4c92c0fc3.mockapi.io/Allinstructor/${id}`)
      .then((response) => {
        setInstructor(response.data);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
  }, [id]);

  if (error) {
    return <Text style={styles.error}>Failed to load instructor details</Text>;
  }

  if (!instructor) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: instructor.image }} style={styles.image} />
      <Text style={styles.name}>{instructor.name}</Text>
      <Text style={styles.details}>{instructor.students}</Text>
      <Text style={styles.details}>{instructor.courses}</Text>
      <Text style={styles.details}>{instructor.category}</Text>
      <View style={styles.socialLinks}>
        <Text style={styles.link}>Facebook: {instructor.facebook}</Text>
        <Text style={styles.link}>Twitter: {instructor.twitter}</Text>
        <Text style={styles.link}>LinkedIn: {instructor.linkedin}</Text>
        <Text style={styles.link}>YouTube: {instructor.youtube}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // styles as before
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
