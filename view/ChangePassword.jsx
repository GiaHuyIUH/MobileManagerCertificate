import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  IconButton,
} from "react-native-paper";
import { useSelector } from "react-redux";
import axios from "axios";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {isValidPassword} from "../regex/regex";

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const token = AsyncStorage.getItem("token");

  const handleChangePassword = async () => {
    setLoading(true);

    if (!newPassword || !confirmPassword || !currentPassword) {
      Alert.alert("All fields are required.");
      setLoading(false);
      return 
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("New password and confirm password do not match.");
      setLoading(false);
      return 
    }
    if (!isValidPassword(newPassword)) {
      Alert.alert(
        "Invalid Password",
        [
          "Password should contain at least:",
          "- least one uppercase letter",
          "- least one special character",
          "- least 8 characters",
        ].join("\n")
      );      setLoading(false);
      return 
    }
    
    try {
      const response = await axios.put(
        `${REACT_APP_API_BASE_URL}/users/change-password/${user._id}`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password changed successfully!");
        await AsyncStorage.removeItem("token");
        // Navigate to login screen
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to change password.");
      }
    } catch (error) {
     
        Alert.alert("Error",error.response.data.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        label="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TextInput
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <HelperText type="info" visible={newPassword.length < 6}>
        Password should be at least 8 characters long and have at least one uppercase, one special character.
      </HelperText>

      <TextInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <Button
        mode="contained"
        onPress={handleChangePassword}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Update Password
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: 24,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#1976d2",
  },
});

export default ChangePassword;
