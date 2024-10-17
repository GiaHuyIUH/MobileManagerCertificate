import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import Loading from "../components/Loading"; // Make sure to adapt Loading for React Native
import NotFound from "./NotFound"; // Adapt this component as well
import { useDispatch, useSelector } from "react-redux";
import { updateEnrollment, completeEnrollment } from "../store/slices/authSlice";
import { REACT_APP_API_BASE_URL } from "../utils/constant";

const LearnCourse = () => {
  const route = useRoute();
  const { id } = route.params; // Get course ID from route params
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_BASE_URL}/course/${id}`);
        setCourseData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const hasEnrolled = user.enrollments.find((enrollment) => enrollment.course.toString() === id);

  useEffect(() => {
    if (hasEnrolled) {
      setCompletedLessons(hasEnrolled.idOfItems || []);
    }
  }, [hasEnrolled]);

  const handleComplete = async (lessonId) => {
    if (!hasEnrolled) {
      Alert.alert("Error", "You are not enrolled in this course.");
      return;
    }
    try {
      const updatedCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(updatedCompletedLessons);
      const response = await axios.put(
        `${API_BASE_URL}/enrollment/${hasEnrolled._id}`,
        { idOfItems: updatedCompletedLessons },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateEnrollment(response.data));
      Alert.alert("Success", "Lesson marked as completed");
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      Alert.alert("Error", "Error marking lesson as completed");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !courseData) {
    return <NotFound />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{courseData.title}</Text>
      {courseData.documents.map((item) => (
        <View key={item._id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardContent}>{item.content}</Text>
          <Button
            title="Mark as Completed"
            onPress={() => handleComplete(item._id)}
            disabled={completedLessons.includes(item._id)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    marginVertical: 10,
    fontSize: 16,
  },
});

export default LearnCourse;
