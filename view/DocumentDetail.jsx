// DocumentDetail.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { updateEnrollment } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const DocumentDetail = ({ route }) => {
  const navigation = useNavigation();
  const { item, enrollmentId, completedLessons ,lengthOfDocuments} = route.params; // Destructure the passed params
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setToken(token);
      } catch (error) {
        console.error("Error getting token from AsyncStorage:", error);
      }
    };
    getToken();
  }, []);


  const handleComplete = async (lessonId) => {
    try {
      const updatedCompletedLessons = [...completedLessons, lessonId];
      const response = await axios.put(
        `${REACT_APP_API_BASE_URL}/enrollment/${enrollmentId}`,
        { idOfItems: updatedCompletedLessons,
          progress: (updatedCompletedLessons.length / lengthOfDocuments) * 100,
         },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateEnrollment(response.data));
      
      navigation.goBack();
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      Alert.alert("Error", "Error marking lesson as completed");
    }
  }; 

  return (
    <ScrollView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        {/* Document Title */}
        <Text style={styles.title}>{item.title}</Text>
      </View>

      {/* Document Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{item.content}</Text>
        {/* Complete button */}

        <TouchableOpacity
          style={[
            styles.button,
            completedLessons.includes(item._id) && styles.buttonCompleted,
          ]}
          onPress={() => handleComplete(item._id)}
          disabled={completedLessons.includes(item._id)}
        >
          <Text style={styles.buttonText}>
            {completedLessons.includes(item._id)
              ? "Completed"
              : "Mark as Completed"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
    paddingBottom:50
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
    marginLeft: 10,
  },
  contentContainer: {
    padding: 20,
  },
  content: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  completeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF", // Consistent with back button
    paddingVertical: 12,
    borderRadius: 50, // Rounded buttons for a modern feel
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    
  },
  buttonCompleted: {
    backgroundColor: "#28A745", // Distinct green for completed lessons
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DocumentDetail;
