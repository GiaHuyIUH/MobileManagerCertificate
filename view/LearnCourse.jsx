import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import Loading from "../components/Loading";
import NotFound from "./NotFound";
import { useDispatch, useSelector } from "react-redux";
import { updateEnrollment } from "../store/slices/authSlice";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LearnCourse = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id ,load} = route.params;
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [token, setToken] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${REACT_APP_API_BASE_URL}/course/${id}`);
      setCourseData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizResults = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_BASE_URL}/quiz/result/user/${user._id}/course/${id}`
      );
      const sortedResults = response.data.sort((a, b) => b.score - a.score);
      const topThreeResults = sortedResults.slice(0, 3);
      setQuizResults(topThreeResults);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setToken(token);
    } catch (error) {
      console.error("Error getting token from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
    fetchQuizResults();
    getToken();
  }, [id]);

  const hasEnrolled = user.enrollments.find((enrollment) => {
    if (!enrollment.course) return false;
    return enrollment.course.toString() === id;
  });

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
        `${REACT_APP_API_BASE_URL}/enrollment/${hasEnrolled._id}`,
        {
          idOfItems: updatedCompletedLessons,
          progress: (updatedCompletedLessons.length / courseData.documents.length) * 100,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateEnrollment(response.data));
      Alert.alert("Success", "Lesson marked as completed");
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      Alert.alert("Error", "Error marking lesson as completed");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourseData();
    await fetchQuizResults();
    setRefreshing(false);
  };
  useEffect(() => {
    if(load){
      onRefresh();
    }
  }, [load]);


  if (loading) {
    return <Loading />;
  }

  if (error || !courseData) {
    return <NotFound />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{courseData.title}</Text>
        </View>

        {/* Lessons */}
        {courseData.documents.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() =>
              navigation.navigate("DocumentDetail", {
                item: item,
                enrollmentId: hasEnrolled._id,
                completedLessons: completedLessons,
                lengthOfDocuments: courseData.documents.length,
              })
            }
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardContent} numberOfLines={5}>
                {item.content}
              </Text>
              <TouchableOpacity
                style={[
                  styles.button,
                  completedLessons.includes(item._id) && styles.buttonCompleted,
                ]}
                disabled={true}
              >
                <Text style={styles.buttonText}>
                  {completedLessons.includes(item._id)
                    ? "Completed"
                    : "Mark as Completed"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{courseData.finalQuiz.title}</Text>
            <Text style={styles.description}>
              {courseData.finalQuiz.description}
            </Text>
            <Text style={styles.subtitle}>Previous Quiz Scores:</Text>
            {quizResults.length > 0 ? (
              quizResults.map((item, index) => (
                <Text key={index} style={styles.quizResult}>
                  Attempt {index + 1}: {item.score}%
                </Text>
              ))
            ) : (
              <Text style={styles.noQuiz}>No quiz attempts yet.</Text>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    completedLessons.length !== courseData.documents.length
                      ? "#A9A9A9"
                      : hasEnrolled.completed
                      ? "#28A745"
                      : "#007BFF",
                },
              ]}
              disabled={
                completedLessons.length !== courseData.documents.length ||
                hasEnrolled.completed
              }
              onPress={() => {
                navigation.navigate("FinalTest", {
                  courseData: courseData,
                  courseId: id,
                });
              }}
            >
              <Text style={styles.buttonText}>
                {hasEnrolled.completed ? "Quiz Completed" : "Start Quiz"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
    marginLeft: 10,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonCompleted: {
    backgroundColor: "#28A745",
  },
  quizResult: {
    fontSize: 16,
    color: "#222",
    marginBottom: 8,
  },
  noQuiz: {
    fontSize: 16,
    color: "#A9A9A9",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
});

export default LearnCourse;
