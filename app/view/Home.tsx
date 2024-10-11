import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Import axios
import { API_BASE_URL } from "../utils/constants";
import { updateUser } from "../store/slices/authSlice";

const Home = ({ navigation}) => {


  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
     
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  divider: {
    alignItems: "center",
    marginVertical: 10,
  },
  googleButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 10,
  },
  linkContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  link: {
    color: "blue",
  },
});

export default Home;
