import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { NavigationProp } from "@react-navigation/native";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isEmail } from "../regex/regex";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("dochituongshpy@gmail.com");
  const [password, setPassword] = useState("Tuong@2003");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      
      if (!email) {
        Alert.alert("Login Failed", "Email is required");
        return;
      }
     
      if(!password) {
        Alert.alert("Login Failed", "Password is required");
        return;
      }
      if(isEmail(email) === false) {
        Alert.alert("Login Failed", "Email is invalid");
        return;
      }

      const response = await axios.post(
        `${REACT_APP_API_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      const { user, token } = response.data;

      if (user) {
        // Save token to localStorage
        await AsyncStorage.setItem("token", token);

        dispatch(login(user));

        if (user.role === "customer") {
          navigation.replace("Main");
        } else {
          Alert.alert("Login Failed", "Only customers can login from mobile.");
        }
      } else {
        Alert.alert("Login Failed", "User data not found.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Handle Forgot Password button press
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword"); // Navigate to ForgotPassword screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#f9f9f9",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: 45,
            paddingHorizontal: 12,
            fontSize: 16,
            color: "#333",
          }}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={{
            paddingHorizontal: 15,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Text style={{ color: "#007bff", fontWeight: "600", fontSize: 16 }}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleForgotPassword}
        style={styles.forgotButton}
      >
        <Text style={styles.forgotButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        New to our website?{" "}
        <Text onPress={() => navigation.navigate("Signup")} style={styles.link}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  forgotButton: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  forgotButtonText: {
    color: "#007BFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

export default Login;
