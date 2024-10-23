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
import NotFound from "./view/NotFound";
import LearnCourse from "./view/LearnCourse";
import CourseDetail from "./view/CourseDetail";
import Connect from "./view/Connect";
import DocumentDetail from "./view/DocumentDetail";
import FinalTest from "./view/FinalTest";
import SearchPage from "./view/SearchPage";


const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Login">
        {/* <Stack.Screen
            name="LearnCourse"
            component={LearnCourse}
            options={{ headerShown: false }} // Hide the header
          /> */}
        <Stack.Screen
            name="Connect"
            component={Connect}
            options={{ headerShown: false }} // Hide the header
          />
           <Stack.Screen
            name="SearchPage"
            component={SearchPage}
            options={{ headerShown: false }} // Hide the header
          />
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
            name="DocumentDetail"
            component={DocumentDetail}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="FinalTest"
            component={FinalTest}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="OrganizationDetail"
            component={OrganizationDetail}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="NotFound"
            component={NotFound}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="LearnCourse"
            component={LearnCourse}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetail}
            options={{ headerShown: false }} // Hide the header
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
