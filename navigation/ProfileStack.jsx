import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../view/Profile";
import Certificates from "../view/Certificates";
import ChangePassword from "../view/ChangePassword";
import ForgotPassword from "../view/ForgotPassword";
import OTPScreen from "../view/OTPScreen";
import RefreshPassword from "../view/RefreshPassword";

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileStack"
        component={Profile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Certificates"
        component={Certificates}
        options={{ title: "Accomplishments" }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: "" }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="OTPSCreen"
        component={OTPScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RefreshPassword"
        component={RefreshPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
