import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Text, Card, Avatar, Button } from "react-native-paper";
import axios from "axios";
import { REACT_APP_API_BASE_URL } from "../utils/constant";


const DetailCertificate = () => {
  const route = useRoute();
  const { id } = route.params;
  const [user, setUser] = useState({});
  const [certificate, setCertificate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        setLoading(true);
        const certResponse = await axios.get(
          `${REACT_APP_API_BASE_URL}/certificates/${id}`
        );
        setCertificate(certResponse.data);

        const userResponse = await axios.get(
          `${REACT_APP_API_BASE_URL}/users/${certResponse.data.user._id}`
        );
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching certificate data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [id]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {certificate.course ? certificate.course.title : certificate.bundle?.title}
      </Text>

      {/* User Information and Completion Status */}
      <Card style={styles.infoCard}>
        <View style={styles.infoContainer}>
          <Avatar.Image source={{ uri: user.avt }} size={50} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Completed by {user.name || "Unknown User"}</Text>
            <Text>Score: <Text style={styles.boldText}>{certificate.score}</Text></Text>
            <Text>{formatDate(certificate.issueDate)}</Text>
          </View>
        </View>
        <View style={styles.checkIcon}>
          <Text style={styles.iconText}>✓</Text>
        </View>
      </Card>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Description</Text>
        <Text>
        {certificate?.course ? certificate.course.title : certificate.bundle?.title}
        </Text>
      </View>

      {/* Organization Information */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>About Organization</Text>
        <View style={styles.organizationInfo}>
          <Avatar.Image
            source={{ uri: certificate.organization?.avatar }}
            size={40}
          />
          <View style={styles.organizationDetails}>
            <Text>{certificate.organization?.name || "Unknown Organization"}</Text>
            <Text>{certificate.organization?.email || "No email available"}</Text>
          </View>
        </View>
      </View>

      {/* Certificate Image */}
      <Card style={styles.certificateImageCard}>
        <Image
          source={{ uri: certificate.imageUrl }}
          style={styles.certificateImage}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
    textAlign: "center",
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#d6edf6",
    borderRadius: 10,
    marginBottom: 20,
    position: "relative",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
  },
  boldText: {
    fontWeight: "bold",
  },
  checkIcon: {
    position: "absolute",
    right: 20,
    fontSize: 32,
    color: "#4caf50",
  },
  section: {
    marginVertical: 10,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  organizationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  organizationDetails: {
    marginLeft: 10,
  },
  certificateImageCard: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  certificateImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
});

export default DetailCertificate;
