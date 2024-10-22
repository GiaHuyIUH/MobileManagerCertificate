import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addEnrollmentToUser } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { payForCourse } from "../contract";
import { ethers } from "ethers";
const CourseDetail = ({ navigation }) => {
  const route = useRoute();
  const { id } = route.params; // Get course ID from params
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const walletAddress = useSelector((state) => state.wallet.address);

  const { provider } = useWalletConnectModal();
  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_API_BASE_URL}/course/${id}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Show loading indicator while fetching
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!course) {
    return (
      <View style={styles.centeredView}>
        <Text>404: Page Not Found.</Text>
      </View>
    );
  }

  const hasEnrolled = user?.enrollments.some((enrollment) => {
    if (!enrollment.course) return false;
    return enrollment.course.toString() === course._id;
  });

  const handleButtonClick = async () => {
    if (!user) {
      setMessage("You must be logged in to enroll in a course.");
      navigation.navigate("Login");
      return;
    }

    if (hasEnrolled) {
      navigation.navigate("LearnCourse", { id }); // Navigate to the course learning screen
      return;
    }

    if (!walletAddress) {
      setMessage("Please create a wallet to enroll in the course.");
      return;
    }

    try {
      setIsProcessing(true);
      const studentId = user._id;
      const amount =
        course.price === 0
          ? ethers.utils.parseEther("0.000000001")
          : ethers.utils.parseEther((course.price / 1000).toString());
      // const amount =
      //   course.price === 0 ? 0.000000001 : (course.price / 1000).toFixed(18);
      const walletOr =
        course.organization.walletaddress ||
        "0x6087050c4069ab730d872e625E035A8fd8DeD600";

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("token");

      // Simulate payment processing result
      const paymentResult = await payForCourse(
        provider,
        course._id,
        studentId,
        user.name,
        walletOr,
        course.organization.name,
        amount
      );
      console.log("Payment result:", paymentResult);
      if (paymentResult.success) {
        const response = await axios.post(
          `${REACT_APP_API_BASE_URL}/enrollment`,
          {
            user: studentId,
            course: course._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the retrieved token
            },
          }
        );

        console.log("Enrollment created successfully:", response.data);
        dispatch(addEnrollmentToUser(response.data));
        navigation.navigate("LearnCourse", { id }); // Navigate to the learning page
      } else {
        navigation.navigate("Connect");
      }
    } catch (error) {
      console.error("Failed to process payment or create enrollment:", error);
      setMessage(
        "Failed to process payment or create enrollment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Image
            source={{ uri: course.image }}
            style={{ height: 200, width: "100%", resizeMode: "cover" }}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: "white",
            marginBottom: 15,
          }}
        >
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text
            style={styles.description}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {course.description}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 5,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => setIsExpanded(!isExpanded)}
            >
              {!isExpanded ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#0D92F4" }}>Show More</Text>
                  <AntDesign
                    name="down"
                    size={20}
                    color="black"
                    style={{ marginLeft: 5, color: "#0D92F4" }}
                  />
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#0D92F4" }}>Show Less</Text>
                  <AntDesign
                    name="up"
                    size={20}
                    color="black"
                    style={{ marginLeft: 5, color: "#0D92F4" }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.detailsContainer}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>Price: </Text>
              <Text style={{ fontSize: 20 }}>${course.price}</Text>
            </View>
            <TouchableOpacity
              onPress={handleButtonClick}
              disabled={isProcessing}
              style={{
                backgroundColor: isProcessing ? "#a5a5a5" : "#007BFF",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}
              >
                {isProcessing
                  ? "Processing..."
                  : hasEnrolled
                  ? "Go to Course"
                  : "Join Course"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: "white",
          }}
        >
          <Text style={styles.sectionTitle}>Provided by</Text>
          {course.organization && (
            <View style={styles.organizationContainer}>
              <Image
                source={{ uri: course.organization.avatar }}
                style={styles.organizationImage}
              />
              <View>
                <Text style={styles.organizationName}>
                  {course.organization.name}
                </Text>
                <Text>Address: {course.organization.address}</Text>
                <Text>Email: {course.organization.email}</Text>
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: "white",
            marginTop: 15,
          }}
        >
          <Text style={styles.sectionTitle}>Course Sections</Text>
          {course.documents.map((item, index) => (
            <View key={index} style={styles.sectionItem}>
              <Text style={styles.sectionItemTitle}>{item.title}</Text>
              <Text numberOfLines={3}>
                {item.content || "No content available"}
              </Text>
            </View>
          ))}
        </View>

        {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  description: {
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    padding: 16,
  },
  sectionItem: {
    marginBottom: 16,
    borderBottomColor: "#ccc",
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionItemTitle: {
    fontWeight: "bold",
  },
  organizationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizationName: {
    fontWeight: "bold",
  },
  organizationImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginVertical: 8,
    borderColor: "blue",
    borderWidth: 1,
    marginRight: 16,
  },
  errorMessage: {
    color: "red",
    marginTop: 16,
  },
});

export default CourseDetail;
