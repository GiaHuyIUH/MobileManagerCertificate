import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyCourses = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Courses</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default MyCourses;
