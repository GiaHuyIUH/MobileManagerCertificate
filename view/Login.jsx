import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

// web: 520064953188-o0orgdhelcn97rb2k1o1m5r5u6sdc3as.apps.googleusercontent.com
// ios: 520064953188-bv8e00ehsp4el7pe1nmj8sf1hoc8sgqp.apps.googleusercontent.comexpo
// android: 520064953188-enkpvhifd1qf7pu020o9c44ph7koa5ur.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("tranhuy12072003@gmail.com");
  const [password, setPassword] = useState("Anhbakhia3@");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  console.log(makeRedirectUri({ useProxy: true }));
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "520064953188-o0orgdhelcn97rb2k1o1m5r5u6sdc3as.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({
      useProxy: true, // Đảm bảo sử dụng `useProxy` để Expo tự động thêm URI proxy
    }),
  });

  useEffect(() => {
    console.log("req: ", request);

    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      console.log("Success: ", response.authentication.accessToken);
      accessToken && fetchGoogleUser();
    } else if (response?.type === "error") {
      console.error("OAuth Error:", response.error);
    }
  }, [response]);

  async function fetchGoogleUser() {
    if (!accessToken) return;

    try {
      const response = await axios.get(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userInfo = response.data;
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  const handleLogin = async () => {
    setLoading(true); // Set loading state to true
    try {
      console.log(REACT_APP_API_BASE_URL);
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

        // Navigate based on user role
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
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

      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
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
