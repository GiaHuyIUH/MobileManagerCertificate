import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { updateUser } from "../store/slices/authSlice";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const dispatch = useDispatch();
  const oldUser = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(oldUser);
  const [avatarURL, setAvatarURL] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date(user.birthday || Date.now())
  );

  useEffect(() => {
    fetchCertificates();
  }, [avatarURL]);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_BASE_URL}/certificates/student/${user._id || user.id}`
      );
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates: ", error);
    }
  };

  const handleInputChange = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setUser({
        ...user,
        avt: pickerResult.uri,
      });
      setAvatarURL(pickerResult.uri);
    }
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    if (user.birthday !== undefined) {
      formData.append("birthday", user.birthday);
    }
    formData.append("name", user.name);
    formData.append("email", user.email);
    if (user.numberphone !== undefined) {
      formData.append("numberphone", user.numberphone);
    }
    if (user.avt) {
      formData.append("avt", {
        uri: user.avt,
        name: "avatar.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const id = oldUser.id === undefined ? oldUser._id : oldUser.id;
      const response = await axios.put(
        `${REACT_APP_API_BASE_URL}/users/change-infor/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(updateUser(response.data));
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setShowDatePicker(false); // Close the date picker after a date is selected
      setSelectedDate(selectedDate); // Update the selected date state
      handleInputChange("birthday", selectedDate.toISOString()); // Update the user object with the new birthday
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true); // Only show DatePicker when user taps on it
  };

  const handleModalOpen = () => {
    setOpenModal(true);
    setShowDatePicker(false); // Reset DatePicker visibility when opening modal
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setUser(oldUser);
    setAvatarURL(null);
    console.log("User: ", user);
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: avatarURL || oldUser.avt }}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.username}>{oldUser.name}</Text>
            <TouchableOpacity
              onPress={handleModalOpen}
              style={styles.editButton}
            >
              <FontAwesome name="edit" size={24} color="blue" />
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} />
          </TouchableOpacity>
        </View>

        <Modal visible={openModal} animationType="slide" transparent={false}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={handleModalClose}
              style={{ alignSelf: "flex-end" }}
            >
              <Ionicons name="close-circle-sharp" color={"red"} size={22} />
            </TouchableOpacity>

            <Image
              source={{ uri: user.avt }}
              style={[styles.avatar, { alignSelf: "center" }]}
            />
            <TouchableOpacity
              onPress={handleImageChange}
              style={{
                alignSelf: "center",
                padding: 10,
                backgroundColor: "#1976d2",
                borderRadius: 25,
                marginVertical: 10,
              }}
            >
              <Text
                style={{ textAlign: "center", fontWeight: 600, color: "#fff" }}
              >
                Change photo
              </Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Edit Personal Details</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={user.name}
              placeholder="Name"
              onChangeText={(value) => handleInputChange("name", value)}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={user.address}
              onChangeText={(value) => handleInputChange("address", value)}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              editable={false}
            />

            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={user.numberphone}
              onChangeText={(value) => handleInputChange("numberphone", value)}
            />

            <Text style={styles.label}>Birthday</Text>
            <TouchableOpacity onPress={showDatepicker}>
              <Text style={styles.input}>
                {selectedDate ? selectedDate.toLocaleDateString("en-US") : ""}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <TouchableOpacity
              onPress={handleImageChange}
              style={{
                alignSelf: "center",
                padding: 10,
                backgroundColor: "#1976d2",
                borderRadius: 25,
                marginVertical: 10,
              }}
            >
              <Text
                style={{ textAlign: "center", fontWeight: 600, color: "#fff" }}
              >
                SAVE
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Certificates</Text>
        <View style={styles.certificatesContainer}>
          {certificates.slice(0, visibleCount).map((cert) => (
            <View key={cert._id} style={styles.certificateCard}>
              <Image
                source={{ uri: cert.imageUrl }}
                style={styles.certificateImage}
              />
              <Text style={styles.certificateTitle}>
                {cert.course?.title || cert.bundle.title}
              </Text>
            </View>
          ))}
          {visibleCount < certificates.length && (
            <Button
              title="See More"
              onPress={() => setVisibleCount(visibleCount + 4)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  infoContainer: { flex: 1 },
  username: { fontSize: 22, fontWeight: "600" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  editText: { color: "blue", marginLeft: 8 },
  modalView: {
    padding: 20,
    backgroundColor: "#ccc",
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, marginVertical: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    paddingLeft: 8,
  },
  certificatesContainer: { flexDirection: "row", flexWrap: "wrap" },
  certificateCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: "1%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  certificateImage: { width: "100%", height: 80, borderRadius: 4 },
  certificateTitle: { marginTop: 8, fontWeight: "500" },
});

export default Profile;
