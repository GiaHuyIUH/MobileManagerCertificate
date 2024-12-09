import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { logoutUser, updateUser } from "../store/slices/authSlice";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import {isBirthdate, isTenDigitNumber} from "../regex/regex";
import { err } from "react-native-svg";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const oldUser = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(oldUser);
  const [avatarURL, setAvatarURL] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date(user.birthday || Date.now())
  );

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
    if (!pickerResult.canceled) {
      const newAvatarUri = `${
        pickerResult.assets[0].uri
      }?timestamp=${new Date().getTime()}`;
      setUser({ ...user, avt: newAvatarUri });
      setAvatarURL(newAvatarUri);
    }
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    if (user.birthday !== undefined) {
      if (!isBirthdate(user.birthday)) {
        alert(" Birthday must be before today");
        return;
      }
      formData.append("birthday", user.birthday);
    }
    formData.append("name", user.name);
    formData.append("email", user.email);
    if (user.numberphone !== undefined) {
      if(isTenDigitNumber(user.numberphone) === false) {
        alert("phone number must be 10 digits");
        return;
      }
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
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      dispatch(logoutUser());
      navigation.replace("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
      <View style={styles.profileContainer}>
        <Image
          style={[styles.avatar]}
          source={{ uri: avatarURL || oldUser?.avt }}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.username}>{oldUser?.name}</Text>
          <TouchableOpacity onPress={handleModalOpen} style={styles.editButton}>
            <FontAwesome name="edit" size={24} color="#1976d2" />
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
            key={avatarURL} // Add this line
            style={[styles.avatar, { alignSelf: "center" }]}
            source={{ uri: avatarURL || oldUser?.avt }}
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
            value={user?.name}
            placeholder="Name"
            onChangeText={(value) => handleInputChange("name", value)}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={user?.address}
            onChangeText={(value) => handleInputChange("address", value)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={user?.email} editable={false} />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            value={user?.numberphone}
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
            onPress={handleProfileUpdate}
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

      <FlatList
        data={[
          {
            id: 0,
            title: "Connect metamask",
            icon: "link-outline",
            name: "Connect",
          },
          {
            id: 1,
            title: "Accomplishments",
            icon: "ribbon-outline",
            name: "Certificates",
          },
          {
            id: 2,
            title: "Change Password",
            icon: "key-outline",
            name: "ChangePassword",
          },
          {
            id: 3,
            title: "Forgot Password",
            icon: "help-circle-outline",
            name: "ForgotPassword",
          },
          {
            id: 4,
            title: "Stats",
            icon: "stats-chart",
            name: "Stats",
          },
          {
            id: 5,
            title: "Log out",
            icon: "log-out-outline",
            name: "Logout",
          },
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => {
              item.name === "Logout"
                ? logout()
                : navigation.navigate(item.name);
            }}
          >
            <View style={styles.cardContent}>
              <Text style={styles.optionTitle}>{item.title}</Text>
              <Ionicons name={item.icon} size={24} color="#1976d2" />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
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
    margin: 15,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  infoContainer: { flex: 1 },
  username: { fontSize: 22, fontWeight: "600" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  editText: { color: "#1976d2", marginLeft: 8 },
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

  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionTitle: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
});

export default Profile;
