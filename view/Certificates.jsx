import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { Text, Button, Card, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import axios from "axios";

const Certificates = () => {
  const navigation = useNavigation(); // Initialize navigation
  const user = useSelector((state) => state.auth.user);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_BASE_URL}/certificates/student/${user._id || user.id}`
      );
      setCertificates(response.data);
    } catch (error) {
      setError("Failed to load certificates.");
      console.error("Error fetching certificates: ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCertificate = ({ item }) => (
    <Card
      style={styles.card}
      elevation={3}
      onPress={() => navigation.navigate("Detaicertificate", { id: item._id })} // Pass certificate ID
    >
      <Card.Cover source={{ uri: item.imageUrl }} style={styles.certificateImage} />
      <Card.Content>
        <Text style={styles.certificateTitle}>{item.course?.title || item.bundle.title}</Text>
        <View style={styles.organizationInfo}>
          <Avatar.Image size={32} source={{ uri: item.organization.avatar }} />
          <Text style={styles.organizationName}>{item.organization.name}</Text>
        </View>
        <Text style={styles.issueDate}>Issued on: {new Date(item.issueDate).toLocaleDateString()}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#1976d2" style={styles.loading} />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchCertificates}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={certificates.slice(0, visibleCount)}
        renderItem={renderCertificate}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false} // Hide scrollbar
      />
      {visibleCount < certificates.length && (
        <Button
          mode="outlined"
          onPress={() => setVisibleCount(visibleCount + 4)}
          style={styles.seeMoreButton}
        >
          See More
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  certificateImage: {
    height: 180,
  },
  certificateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976d2",
    marginVertical: 8,
    textAlign: "center",
  },
  organizationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  organizationName: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  issueDate: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
  seeMoreButton: {
    marginTop: 16,
    alignSelf: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 16,
  },
});

export default Certificates;
