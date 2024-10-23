import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button, Text, RadioButton, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { completeEnrollment } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure you import AsyncStorage
import axios from "axios";
import Loading from "../components/Loading";

const FinalTest = ({ route }) => {
  const navigation = useNavigation();
  const [quizAnswers, setQuizAnswers] = useState({});
  const { courseData,courseId } = route.params;
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const [loadingQuiz, setLoadingQuiz] = useState(false); // Loading state
  const { user } = useSelector((state) => state.auth);

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

  const handleBackToQuizInfo = () => {
    navigation.goBack();
  };

  const handleAnswerChange = (questionId, answer) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer,
    });
  };


  const hasEnrolled = user.enrollments.find((enrollment) => {
    if (!enrollment.course) return false;
    return enrollment.course.toString() === courseId;
  });
  const handleSubmitQuiz = async () => {
    setLoadingQuiz(true);
    const submissionData = {
      userId: user._id,
      courseId: courseId,
      answers: Object.keys(quizAnswers).map((questionId) => {
        const question = courseData.finalQuiz.questions.find(
          (q) => q._id === questionId
        );
        const selectedAnswer = question.options.find(
          (option) => option._id === quizAnswers[questionId]
        );
        return {
          questionId,
          answerText: selectedAnswer.text,
        };
      }),
    };

    try {
      // Submit the quiz
      const response = await axios.post(
        `${REACT_APP_API_BASE_URL}/quiz/submit`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful submission
      const newQuizResult = response.data.quizResult;

      if (newQuizResult.score >= 70) {
        try {
          const certificateData = {
            user: user._id,
            organization: courseData.organization._id, // Assuming courseData contains the organizationId
            course: courseId,
            score: newQuizResult.score,
          };

          const certificateResponse = await axios.post(
            `${REACT_APP_API_BASE_URL}/certificates`,
            certificateData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch(completeEnrollment(hasEnrolled._id));
          // Navigate to Home after successfully creating the certificate
          navigation.navigate("Home"); // Adjust the screen name accordingly
        } catch (certificateError) {
          console.error("Error creating certificate:", certificateError);
          // Handle error when creating certificate
        }
      } else {
        // If the score is less than 70, navigate back
        navigation.navigate("LearnCourse", { id: courseId,load:true }); // Adjust the screen name accordingly
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // Handle error when submitting quiz
    } finally {
      setLoadingQuiz(false); // Stop loading after submission
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToQuizInfo} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{courseData.title}</Text>
      </View>

      {courseData.finalQuiz.questions.map((question, index) => (
        <View key={question._id} style={styles.questionContainer}>
          <Title style={styles.questionText}>
            {index + 1}. {question.questionText}
          </Title>
          <RadioButton.Group
            onValueChange={(value) => handleAnswerChange(question._id, value)}
            value={quizAnswers[question._id] || ""}
          >
            {question.options.map((option) => (
              <RadioButton.Item
                key={option._id}
                label={option.text}
                value={option._id}
                style={styles.radioButton}
              />
            ))}
          </RadioButton.Group>
        </View>
      ))}

      <View style={styles.submitButton}>
        {loadingQuiz ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmitQuiz}
            style={{ backgroundColor: "#007BFF" }}
          >
            Submit
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
  questionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  questionText: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  radioButton: {
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default FinalTest;
