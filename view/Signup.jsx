import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { updateUser } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isEmail, isValidPassword } from "../regex/regex";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      // if (!email || !password || !fullName) {
      //   setError("Please fill in all fields");
      //   return;
      // }
      if (!fullName) {
        setError("Full name is required");
        return;
      }
      if (!email) {
        setError("Email is required");
        return;
      }
      if (isEmail(email) === false) {
        setError("Email is invalid");
        return;
      }

      if (!password) {
        setError("Password is required");
        return;
      }

      if (isValidPassword(password) === false) {
        setError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"
        );
        return;
      }

      const response = await axios.post(
        `${REACT_APP_API_BASE_URL}/auth/signup`,
        {
          email,
          name: fullName,
          password,
        }
      );
      const { token } = response.data;
      await AsyncStorage.setItem("token", token);
      console.log("Signup successful:", response.data);
      dispatch(updateUser(response.data.user));
      navigation.replace("Main");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "An error occurred");
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Full name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Email <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          Password <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
          }}
        >
          <TextInput
            style={{ flex: 1, height: 40, paddingHorizontal: 10 }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ paddingHorizontal: 10 }}
          >
            <Text style={{ color: "blue", fontWeight: "bold" }}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Sign Up" onPress={handleSignup} />

      <View style={styles.divider}>
        <Text>or</Text>
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Text>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text>
          Already have an account?{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </Text>
      </View>
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
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  required: {
    color: "red",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
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

export default Signup;
