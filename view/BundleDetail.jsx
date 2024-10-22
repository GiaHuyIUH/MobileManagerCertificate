import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import axios from "axios";
import { addCertificateToUser } from "../store/slices/authSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BundleDetail = () => {
  const { params } = useRoute();
  const { id } = params;
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [bundle, setBundle] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [token, setToken] = useState(null);

  const getEnrollmentStatus = (courseId) => {
    if (!user || !user.enrollments) return null;
    return user.enrollments.find(
      (enrollment) => enrollment.course === courseId
    );
  };
  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_API_BASE_URL}/coursebundles/getid/${id}`
        );
        setBundle(response.data);
      } catch (error) {
        console.error("Error fetching bundle:", error);
        setMessage("Failed to load bundle details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [id]);


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

  const hasCertificate = user?.certificates?.some(
    (certificate) => certificate?.bundle === id
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!bundle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{message || "No bundle found."}</Text>
      </View>
    );
  }

  const canGetCertificate = () => {
    if (!user || !bundle.courses) return false;
    return bundle.courses.every((course) => {
      const enrollment = getEnrollmentStatus(course._id);
      return enrollment?.completed;
    });
  };

  const handleGetCertificate = async () => {
    setModalOpen(true);
    try {
      const studentId = user?._id ;
      

     const r= await axios.post(
        `${REACT_APP_API_BASE_URL}/enrollment/createBundleEnrollment`,
        {
          user: studentId,
          bundle: bundle._id,
        },{
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào headers
          },
        }
      );
      const organizationId = bundle.organization._id;
      const response = await axios.post(
        `${REACT_APP_API_BASE_URL}/certificates/createCertificateBunble`,
        {
          user: studentId,
          organization: organizationId,
          bunbles: bundle._id,
        },{
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào headers
          },
        }
      );

      if (response.data) {
        dispatch(addCertificateToUser(response.data.certificate));
        setMessage("Certificate has been successfully issued!");
      } else {
        setMessage("Failed to issue certificate. Please try again.");
      }
    } catch (error) {
      console.error("Error in getting certificate:", error);
      setMessage("Failed to get certificate. Please try again.");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: bundle.image }}
          style={styles.bundleImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.bundleTitle}>{bundle.title}</Text>
        <Text
          style={styles.bundleDescription}
          numberOfLines={isExpanded ? undefined : 3}
        >
          {bundle.description}
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
        <Button
          title={
            hasCertificate
              ? "You have already received the certificate"
              : canGetCertificate()
                ? "Get Certificate"
                : "Complete All Courses to Get Certificate"
          }
          onPress={handleGetCertificate}
          disabled={!canGetCertificate() ||hasCertificate}
        />
      </View>
      <View
        style={[
          styles.detailsContainer,
          {
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          },
        ]}
      >
        {/* Organization Info */}
        <Image
          source={{ uri: bundle.organization.avatar }}
          style={{
            borderRadius: 50,
            height: 50,
            width: 50,
            borderColor: "blue",
            borderWidth: 1,
          }}
          resizeMode="cover"
        />
        <View>
          <Text style={styles.organizationInfo}>
            Organization: {bundle.organization?.name}
          </Text>
          <Text style={styles.organizationInfo}>
            Address: {bundle.organization?.address}
          </Text>
          <Text style={styles.organizationInfo}>
            Email: {bundle.organization.email}
          </Text>
        </View>
      </View>
      {/* // Courses in this Bundle */}
      <Text style={styles.coursesHeader}>Courses in this Bundle:</Text>
      <ScrollView horizontal={true} style={{ paddingVertical: 10 }}>
        {bundle.courses.map((course) => {
          const enrollment = getEnrollmentStatus(course._id);
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CourseDetail", {
                  id: course._id,
                })
              }
              key={course._id}
              style={{
                width: 200, // Điều chỉnh kích thước tùy ý
                margin: 10,
                backgroundColor: "white", // Màu nền
                borderRadius: 10,
                padding: 10,
                elevation: 2, // Đổ bóng nhẹ cho item
              }}
            >
              <Image
                source={{ uri: course.image }}
                style={{
                  width: "100%",
                  height: 100, // Điều chỉnh chiều cao tùy ý
                  borderRadius: 10,
                  marginBottom: 5, // Thêm khoảng cách dưới ảnh
                }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16, // Tăng kích thước chữ cho tiêu đề
                }}
              >
                {course.title}
              </Text>
              <Text
                style={{
                  fontSize: 14, 
                  color: "#555", 
                  lineHeight: 20, 
                  minHeight: 60, 
                }}
                numberOfLines={3}
              >
                {course.description}
              </Text>

              <Text
                style={{
                  marginTop: 5,
                  color: "green",
                  fontWeight: "bold", // Đậm hơn để nổi bật
                }}
              >
                Price: ${course.price}
              </Text>
              {enrollment && (
                <>
                  <Text
                    style={{ fontSize: 14, color: "#3b82f6", marginBottom: 5 }}
                  >
                    Progress: {parseFloat(enrollment.progress.toFixed(1))}%
                  </Text>
                  {/* ProgressBar for React Native */}
                  <ProgressBar
                    progress={enrollment.progress / 100}
                    color="#3b82f6" // primary color
                    style={{ marginBottom: 10, height: 8, borderRadius: 5 }}
                  />

                  {enrollment.completed ? (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#4caf50",
                      }}
                    >
                      Completed
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#f44336",
                      }}
                    >
                      Not completed
                    </Text>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.modalText}>Processing your certificate...</Text>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageContainer: {
    position: "relative",
  },
  bundleImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  detailsContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  bundleTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bundleDescription: {
    marginTop: 10,
    fontSize: 16,
  },
  organizationInfo: {
    marginTop: 5,
    fontSize: 14,
  },
  coursesHeader: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  courseItem: {
    marginRight: 20,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
  },
  courseImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  courseTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },
  coursePrice: {
    marginTop: 5,
    color: "#007BFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalText: {
    color: "#ffffff",
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    color: "red",
    fontSize: 18,
  },
  toggleText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default BundleDetail;
