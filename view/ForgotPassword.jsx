import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Image, Alert } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ForgotPasswordScreen = ({ navigation }) => {
  const [token, setToken] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [emailToSend, setEmail] = useState(user ? user.email : "");
  const [emailNew, setEmailNew] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken || undefined);
    };
    getToken();
  }, []);

  console.log("Token:", token);

  const handleSendCodeEmail = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_API_BASE_URL}/users/send-code`,
        { email: emailToSend || emailNew },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const code = response.data.code;
      console.log("Verification code sent:", code);
      return code; // Return the code for further use
    } catch (err) {
      console.error("Error sending verification code:", err);
      Alert.alert("Error sending verification code.");
      return null;
    }
  };

  const handleClickSentCode = async () => {
    const code = await handleSendCodeEmail(); // Wait until the code is set
    if (code) {
      navigation.navigate("OTPSCreen", {
        email: emailToSend || emailNew,
        verificationCode: code, // Pass the latest code to OTPScreen
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Illustration */}
      <Image
        source={require("../assets/forgotpass.png")} // replace with actual image URL
        style={styles.image}
      />

      {/* Title and Subtitle */}
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter your email to send a one-time password
      </Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            value={token ? emailToSend : emailNew}
            editable={!token}
            onChangeText={setEmailNew}
            keyboardType="email-address"
          />
          <IconButton icon="email" size={20} color="gray" />
        </View>
      </View>

      {/* Continue Button */}
      <Button
        mode="contained"
        style={styles.continueButton}
        onPress={() => handleClickSentCode()}
      >
        Send OTP
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 5,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  continueButton: {
    width: "100%",
    borderRadius: 25,
    paddingVertical: 10,
    marginTop: 20,
    backgroundColor: "#1976d2",
  },
});

export default ForgotPasswordScreen;
