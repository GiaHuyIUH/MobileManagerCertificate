// App.js
import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./store/store"; // Path to your store
import Login from "./view/Login";
import Signup from "./view/Signup";
import Home from "./view/Home";
import Main from "./view/Main";
import BundleDetail from "./view/BundleDetail";
import OrganizationDetail from "./view/OrganizationDetail";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="BundleDetail"
            component={BundleDetail}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="OrganizationDetail"
            component={OrganizationDetail}
            options={{ headerShown: false }} // Hide the header
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
