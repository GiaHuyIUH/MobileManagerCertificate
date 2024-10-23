import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import axios from "axios"; 
import { REACT_APP_API_BASE_URL } from "../utils/constant"; 
import { useSelector } from "react-redux";
import { ProgressBar } from "react-native-paper"; 
import Feather from "@expo/vector-icons/Feather";

const MyCourses = ({ navigation }) => {
  const [coursesData, setCoursesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_API_BASE_URL}/enrollment/userHaveBunbleAndCourse/${user._id}`
        );
        setCoursesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses and bundles:", error);
        setLoading(false);
      }
    };

    fetchCoursesData();
  }, []);

  const filteredCourses = coursesData?.filter((item) => {
    const query = searchQuery.toLowerCase();
    const title = item?.bundle?.title || item?.course?.title;
    
    if (filter === "all" && title.toLowerCase().includes(query)) return true;
    if (filter === "completed" && item.completed && title.toLowerCase().includes(query)) return true;
    if (filter === "notCompleted" && !item.completed && title.toLowerCase().includes(query)) return true;
    if (filter === "bundle" && item.bundle && title.toLowerCase().includes(query)) return true;
    if (filter === "course" && item.course && title.toLowerCase().includes(query)) return true;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Enrollments</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for courses or bundles..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
            <Feather name="x-circle" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Picker */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by: </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filter}
            style={styles.picker}
            onValueChange={(itemValue) => setFilter(itemValue)}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Not Completed" value="notCompleted" />
            <Picker.Item label="Bundle" value="bundle" />
            <Picker.Item label="Course" value="course" />
          </Picker>
        </View>
      </View>

      {/* Display courses and bundles */}
      {filteredCourses && filteredCourses.length > 0 ? (
        filteredCourses.map((item, index) => (
          <View key={index} style={styles.enrollmentContainer}>
            {item.bundle ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("BundleDetail", {
                    id: item.bundle._id,
                  })
                }
              >
                <Image
                  source={{ uri: item.bundle.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.courseTitle}>
                  Bundle: {item?.bundle?.title}
                </Text>
                {item.completed ? (
                  <Text style={styles.completedText}>Completed</Text>
                ) : (
                  <Text style={styles.notCompletedText}>Not completed</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CourseDetail", {
                    id: item.course._id,
                  })
                }
              >
                <Image
                  source={{ uri: item.course.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.courseTitle}>
                  Course: {item?.course?.title}
                </Text>
                <Text style={styles.progressText}>
                  Progress: {item.progress}%
                </Text>
                <ProgressBar
                  progress={item.progress / 100}
                  color="#3b82f6"
                  style={styles.progressBar}
                />
                {item.completed ? (
                  <Text style={styles.completedText}>Completed</Text>
                ) : (
                  <Text style={styles.notCompletedText}>Not completed</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noCoursesText}>No enrollments found.</Text>
      )}
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: '#333',
  },
  enrollmentContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#007BFF',
  },
  progressBar: {
    marginBottom: 10,
    height: 8,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: "#3b82f6",
    marginBottom: 5,
  },
  completedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4caf50",
  },
  notCompletedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f44336",
  },
  noCoursesText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#555",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#555',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: 150,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  clearButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
  },
});

export default MyCourses;
