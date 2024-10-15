import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { NavigationProp } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginProps {
  navigation: NavigationProp<any>;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState("testchangpass@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true); // Set loading state to true
    try {
      console.log(API_BASE_URL);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });


      const { user, token } = response.data;
      
      if (user) {
        // Save token to localStorage
        await AsyncStorage.setItem("token", token);


        dispatch(login(user));

        // Navigate based on user role
        if (user.role === "customer") {
          navigation.navigate("Main");
        } else {
          Alert.alert("Login Failed", "Only customers can login from mobile.");
        }
      } else {
        Alert.alert("Login Failed", "User data not found.");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.message || "Something went wrong");
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
        <Text style={styles.forgotButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
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
