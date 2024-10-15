import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import AntDesign from "@expo/vector-icons/AntDesign";
import Search from "../components/Search";

const  Home = () => {
  const [courses, setCourses] = useState([]);
  const [courseBundles, setCourseBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseLimit, setCourseLimit] = useState(6); // Initial limit for courses
  const [bundleLimit, setBundleLimit] = useState(6); // Initial limit for bundles
  const [totalCourses, setTotalCourses] = useState(0); // State for total courses
  const [totalBundles, setTotalBundles] = useState(0); // State for total bundles
  const [showMoreCourses, setShowMoreCourses] = useState(true); // State to track if 'Show More' is clicked
  const [showMoreBundles, setShowMoreBundles] = useState(true); // State to track if 'Show More' is clicked for bundles
  const navigation = useNavigation();

  // Function to fetch courses and bundles
  const fetchData = async (courseLimit, bundleLimit) => {
    try {
      const coursesResponse = await axios.get(
        `${API_BASE_URL}/course?limit=${courseLimit}`
      );
      const bundlesResponse = await axios.get(
        `${API_BASE_URL}/coursebundles?limit=${bundleLimit}`
      );
      return { courses: coursesResponse.data, bundles: bundlesResponse.data };
    } catch (error) {
      console.error("Error fetching data", error);
      return { courses: [], bundles: [] }; // Return empty lists on error
    }
  };

  // Function to fetch total courses count
  const fetchTotalCoursesCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/countCourse`);
      setTotalCourses(response.data.totalCourses); // Assuming the response returns an object with 'totalCourses' property
    } catch (error) {
      console.error("Error fetching total courses count", error);
    }
  };

  // Function to fetch total bundles count
  const fetchTotalBundlesCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/coursebundles/countCourseBundle`);
      setTotalBundles(response.data.count); // Assuming the response returns an object with 'totalBundles' property
    } catch (error) {
      console.error("Error fetching total bundles count", error);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchTotalCoursesCount(); // Fetch total courses count
      await fetchTotalBundlesCount(); // Fetch total bundles count
      const data = await fetchData(courseLimit, bundleLimit);
      setCourses(data.courses);
      setCourseBundles(data.bundles);
      setLoading(false);
    };

    loadInitialData();
  }, []); // Runs once when component mounts

  const handleShowMoreCourses = async () => {
    setCourseLimit((prevLimit) => prevLimit + 6); // Increase limit by 6
    const data = await fetchData(courseLimit + 6, bundleLimit); // Fetch more courses with the new limit
    setCourses(data.courses); // Update the course list with the fetched data
    if (data.courses.length >= totalCourses) {
      setShowMoreCourses(false); // Hide 'Show More' button if total is reached
    }
  };

  const handleShowLessCourses = async () => {
    setCourseLimit(6); // Reset limit to 6 to show fewer courses
    const data = await fetchData(6, bundleLimit); // Fetch the first 6 courses again
    setCourses(data.courses); // Update the course list with the fetched data
    setShowMoreCourses(true); // Show 'Show More' button
  };

  const handleShowMoreBundles = async () => {
    setBundleLimit((prevLimit) => prevLimit + 6); // Increase limit by 6
    const data = await fetchData(courseLimit, bundleLimit + 6); // Fetch more bundles with the new limit
    setCourseBundles(data.bundles); // Update the bundle list with the fetched data
    if (data.bundles.length >= totalBundles) {
      setShowMoreBundles(false); // Hide 'Show More' button if total is reached
    }
  };

  const handleShowLessBundles = async () => {
    setBundleLimit(6); // Reset limit to 6 to show fewer bundles
    const data = await fetchData(courseLimit, 6); // Fetch the first 6 bundles again
    setCourseBundles(data.bundles); // Update the bundle list with the fetched data
    setShowMoreBundles(true); // Show 'Show More' button
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Total Courses Count */}
      <View style={styles.totalCoursesContainer}>
      <Search/>
      </View>

      {/* Courses Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Courses</Text>
        {courses.map((course) => (
          <TouchableOpacity
            key={course._id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("CourseDetail", { id: course._id })
            }
          >
            <Image source={{ uri: course.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{course.title}</Text>
              <Text style={styles.cardDescription} numberOfLines={3}>{course.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              flexDirection: "row", // Align text and icon in a row
              alignItems: "center", // Center items vertically
              paddingVertical: 10, // Vertical padding
              paddingHorizontal: 15, // Horizontal padding
            }}
            onPress={
              showMoreCourses ? handleShowMoreCourses : handleShowLessCourses
            }
          >
           
              {showMoreCourses ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: '#0D92F4' }}>Show More</Text>
                  <AntDesign
                    name="down"
                    size={20}
                    color="black"
                    style={{ marginLeft: 5, color: '#0D92F4' }}
                  />
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: '#0D92F4' }}>Show Less</Text>
                  <AntDesign
                    name="up"
                    size={20}
                    color="black"
                    style={{ marginLeft: 5, color: '#0D92F4' }}
                  />
                </View>
              )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Course Bundles Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Course Bundles</Text>
        {courseBundles.map((bundle) => (
          <TouchableOpacity
            key={bundle?._id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("BundleDetail", { id: bundle?._id })
            }
          >
            <Image source={{ uri: bundle?.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{bundle?.title}</Text>
    
              <Text style={styles.cardDescription} numberOfLines={3} >{bundle?.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}
            onPress={showMoreBundles ? handleShowMoreBundles : handleShowLessBundles}
          >
            <Text style={{ color: "#0D92F4", fontSize: 16, fontWeight: "bold" }}>
              {showMoreBundles ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: '#0D92F4' }}>Show More</Text>
                  <AntDesign
                    name="down"
                    size={20}
                    color="black"
                    style={{ marginLeft: 5, color: '#0D92F4' }}
                  />
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: '#0D92F4' }}>Show Less</Text>
                  <AntDesign
                    name="up"
                    size={20}
                    color="black"
                    style={{ marginLeft: 5, color: '#0D92F4' }}
                  />
                </View>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  totalCoursesContainer: {
    marginBottom: 20,
  },
  totalCoursesText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
