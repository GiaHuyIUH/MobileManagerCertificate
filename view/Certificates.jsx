import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { Text, Button, Card } from "react-native-paper";
import axios from "axios";

const Certificates = () => {
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
    <Card style={styles.card} elevation={3}>
      <Card.Cover
        source={{ uri: item.imageUrl }}
        style={styles.certificateImage}
      />
      <Card.Content>
        <Text style={styles.certificateTitle}>
          {item.course?.title || item.bundle.title}
        </Text>
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
      <Text style={styles.sectionTitle}>Certificates</Text>
      <FlatList
        data={certificates.slice(0, visibleCount)}
        renderItem={renderCertificate}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  certificateImage: {
    height: 180,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1976d2",
    marginTop: 8,
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
