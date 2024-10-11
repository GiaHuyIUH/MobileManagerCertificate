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

const Signup = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null); // State cho xử lý lỗi
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      // Gửi yêu cầu API
      const response = await axios.post(`${process.env.API_BASE_URL}/auth/signup`, {
        email,
        name: fullName,
        password,
      });

      // Xử lý khi đăng ký thành công
      console.log("Signup successful:", response.data);
      dispatch(updateUser(response.data.user));
      navigation.navigate("Home"); // Hoặc trang nào đó sau khi đăng ký thành công
    } catch (error) {
      // Xử lý lỗi
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "An error occurred");
      Alert.alert("Error", error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
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

export default Signup;
