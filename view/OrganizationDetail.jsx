import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Modal, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { REACT_APP_API_BASE_URL } from "../utils/constant"

const OrganizationDetail = () => {
  const route = useRoute();
  const { id } = route.params; 

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_BASE_URL}/organization/${id}`);
        setOrganization(response.data);
      } catch (error) {
        console.error("Error fetching organization:", error);
        setMessage("Failed to load organization details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!organization) {
    return <Text>{message || "No organization found."}</Text>;
  }

  const handleContact = () => {
    setModalOpen(true);
    // Simulate a contact action (like sending an email or opening a link)
    setTimeout(() => {
      setModalOpen(false);
      setMessage("Your message has been sent to the organization!");
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{organization.name}</Text>
      <Text style={styles.description}>{organization.description}</Text>
      <Text>Address: {organization.address}</Text>
      <Text>Email: {organization.email}</Text>
      <Text>Phone: {organization.phone}</Text>
      <Button title="Contact Organization" onPress={handleContact} />
      {message && <Text style={styles.message}>{message}</Text>}

      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.modalText}>Processing your request...</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    marginTop: 10,
    marginBottom: 10,
  },
  message: {
    color: 'green',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    color: '#ffffff',
    marginTop: 20,
  },
});

export default OrganizationDetail;
