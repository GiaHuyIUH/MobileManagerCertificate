import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

const OTPScreen = ({ navigateion }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { email, verificationCode } = route.params;

  console.log("Email: ", email);
  console.log("Verification code: ", verificationCode);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input if it's not the last input
    if (value && index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = () => {
    const enteredCode = otp.join("");
    console.log("Entered code: ", enteredCode);
    console.log("Verification code: ", verificationCode);

    if (enteredCode == verificationCode) {
      Alert.alert("Verification code is correct!");
      navigation.navigate("RefreshPassword", { email });
    } else {
      Alert.alert("Verification code is incorrect. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verification Code</Text>
      <Text style={styles.subText}>
        We have sent the verification code to your email address
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputs.current[index] = ref)}
          />
        ))}
      </View>

      <Button mode="contained" onPress={handleSubmit}>
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b6b6b",
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 18,
  },
});

export default OTPScreen;
