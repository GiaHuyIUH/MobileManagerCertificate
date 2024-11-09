import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { isValidPassword } from "../regex/regex";

const RefreshPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setReShowPassword] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };

    fetchToken();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_BASE_URL}/users/getuserbyemail/${email}`
      );
      setUser(response.data);
      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      Alert.alert("Error fetching user. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match. Please try again.");
      return;
    }

    if (!user || !user._id) {
      Alert.alert("User data is not available. Please try again.");
      return;
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
      );
      return;
    }

    try {
      const response = await axios.put(
        `${REACT_APP_API_BASE_URL}/users/forgotpassword/${user._id}`,
        {
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Password reset successfully.");
        navigation.navigate("Login"); // Assuming you have a Login screen
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error resetting password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          label="New Password"
          mode="outlined"
          secureTextEntry={showPassword}
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.eyeIcon}
        >
          <Text style={styles.eyeText}>{showPassword ? "Hide " : "Show"}</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          label="Confirm New Password"
          mode="outlined"
          secureTextEntry={showRePassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setReShowPassword((prev) => !prev)}
          style={styles.eyeIcon}
        >
          <Text style={styles.eyeText}>{showRePassword ? "Hide " : "Show"}</Text>
        </TouchableOpacity>
      </View>

      {/* Change Password Button */}
      <Button
        mode="contained"
        onPress={handleChangePassword}
        style={styles.changeButton}
      >
        Change Password
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    
  },
  eyeIcon: {
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
  eyeText: {
    color: "#007bff",
    fontWeight: "600",
    fontSize: 16,
    width: 40,
  },
  changeButton: {
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#00c4cc",
    marginTop: 20,
  },
});

export default RefreshPassword;
