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
} from "react-native";
import { REACT_APP_API_BASE_URL } from "../utils/constant"
import axios from "axios";
import { addCertificateToUser } from "../store/slices/authSlice";
import AntDesign from "@expo/vector-icons/AntDesign";

const BundleDetail = () => {
  const { id } = useRoute().params;
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [bundle, setBundle] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleGetCertificate = async () => {
    setModalOpen(true);
    try {
      const studentId = user?._id || "guest";
      await axios.post(`${REACT_APP_API_BASE_URL}/enrollment/createBundleEnrollment`, {
        user: studentId,
        bundle: bundle._id,
      });

      const organizationId = bundle.organization._id;
      const response = await axios.post(
        `${REACT_APP_API_BASE_URL}/certificates/createCertificateBunble`,
        {
          user: studentId,
          organization: organizationId,
          bunbles: bundle._id,
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
    <ScrollView style={styles.container}>
      {/* Image and Back Button */}
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

      {/* Title and Description */}
      <View style={styles.detailsContainer}>
        <Text style={styles.bundleTitle}>{bundle.title}</Text>
        <Text style={styles.bundleDescription} numberOfLines={isExpanded ? undefined : 3}>
          {bundle.description}
        </Text>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.toggleText}>
            {isExpanded ? "See Less" : "See More"}
          </Text>
        </TouchableOpacity>

        {/* Organization Info */}
        <Text style={styles.organizationInfo}>
          Organization: {bundle.organization?.name}
        </Text>
        <Text style={styles.organizationInfo}>
          Address: {bundle.organization?.address}
        </Text>
        <Text style={styles.organizationInfo}>
          Email: {bundle.organization.email}
        </Text>

        {/* Button to navigate to OrganizationDetail */}
        <Button
          title="View Organization Details"
          onPress={() => navigation.navigate("OrganizationDetail", { id: bundle.organization._id })}
        />
        <Button
          title={
            hasCertificate
              ? "You have already received the certificate"
              : "Get Certificate"
          }
          onPress={handleGetCertificate}
          disabled={hasCertificate}
        />
      </View>

      {/* Courses in this Bundle */}
      <Text style={styles.coursesHeader}>Courses in this Bundle:</Text>
      {bundle.courses.map((course) => (
        <View key={course._id} style={styles.courseItem}>
          <Image
            source={{ uri: course.image }}
            style={styles.courseImage}
            resizeMode="cover"
          />
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text>{course.description}</Text>
          <Text style={styles.coursePrice}>Price: ${course.price}</Text>
        </View>
      ))}

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
    marginTop: 20,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  courseItem: {
    marginBottom: 20,
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
