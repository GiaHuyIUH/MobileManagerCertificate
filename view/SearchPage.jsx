import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import axios from "axios";
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { Picker } from "@react-native-picker/picker";
import { id } from "ethers/lib/utils";

const SearchPage = ({ navigation, route }) => {
  const [results, setResults] = useState({ courses: [], bundles: [] });
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [filteredResults, setFilteredResults] = useState({
    courses: [],
    bundles: [],
  });
  const { query } = route.params;

  // Fetch organizations and course counts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_API_BASE_URL}/organization/courses-count`
        );
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  // Fetch search results based on query
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${REACT_APP_API_BASE_URL}/course/search`,
          {
            params: { query: query },
          }
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Filter results based on the selected organization
  useEffect(() => {
    const filterResults = () => {
      const { courses, bundles } = results;

      // Filter courses and bundles based on selected organization
      const filteredCourses =
        selectedOrganization === "all"
          ? courses
          : courses.filter(
              (course) => course.organization === selectedOrganization
            );

      const filteredBundles =
        selectedOrganization === "all"
          ? bundles
          : bundles.filter(
              (bundle) => bundle.organization === selectedOrganization
            );

      setFilteredResults({
        courses: filteredCourses,
        bundles: filteredBundles,
      });
    };

    filterResults();
  }, [results, selectedOrganization]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  const { courses, bundles } = filteredResults;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={query}
          editable={false}
        />
        <Button
          title="Search"
          onPress={() => {
            /* Implement search functionality */
          }}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedOrganization}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedOrganization(itemValue)}
          >
            <Picker.Item label="All Organizations" value="all" />
            {organizations.map((org) => (
              <Picker.Item key={org._id} label={org.name} value={org._id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.title}>Search results for "{query}"</Text>

        {/* Display Course Bundles */}
        {bundles.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.subTitle}>Available Course Bundles</Text>
            {bundles.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() =>
                  navigation.navigate('BundleDetail', { id: item._id })
                }
              >
                <View style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Display Courses */}
        {courses.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.subTitle}>Available Courses</Text>
            {courses.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => navigation.navigate('CourseDetail', { id: item._id })}
              >
                <View style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No results */}
        {bundles.length === 0 && courses.length === 0 && (
          <Text style={styles.noResults}>
            No results found for "{query}". Please try a different search.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#ffffff",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filterLabel: {
    fontWeight: "bold",
    marginRight: 10,
    color: "#343a40",
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden", // To make sure the picker fits within the rounded borders
  },
  picker: {
    height: 50,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsSection: {
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#343a40",
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2, // Adds a shadow effect on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 1, // Shadow radius for iOS
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#212529",
    flex: 1, // Allow title to take remaining space
  },
  noResults: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#6c757d",
  },
});

export default SearchPage;
