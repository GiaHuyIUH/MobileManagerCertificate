import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather"; // Icon "x"
import { REACT_APP_API_BASE_URL } from "../utils/constant";
import { useNavigation } from "@react-navigation/native";

const Search = () => {
  const [query, setQuery] = useState(""); // Search input
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState({
    courses: [],
    bundles: [],
  });
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // State to check if input is focused

  const handleInputChange = (text) => {
    setQuery(text);
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const response = await fetch(
            `${REACT_APP_API_BASE_URL}/course/search?query=${encodeURIComponent(query)}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setSearchResults(data);
          setSearchError(null);
        } catch (error) {
          console.error("Error searching courses:", error);
          setSearchError("Error fetching search results");
          setSearchResults({ courses: [], bundles: [] });
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults({ courses: [], bundles: [] });
      }
    };

    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce time 300ms

    return () => clearTimeout(debounceTimeout); // Cleanup timeout on query change
  }, [query]);

  const clearInput = () => {
    setQuery("");
    setSearchResults({ courses: [], bundles: [] });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={handleInputChange}
              placeholder="Search..."
              placeholderTextColor="#999"
              onFocus={() => setIsFocused(true)} // When focused
              onBlur={() => setIsFocused(false)} // When blurred
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
                <Feather name="x-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('SearchPage', { query: query })}
          >
            <AntDesign name="search1" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {query.length > 0 && ( // Only show results when focused and has text
          <View style={styles.resultsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007BFF" />
            ) : searchError ? (
              <Text style={styles.errorText}>{searchError}</Text>
            ) : (
              <>
                {/* Courses list */}
                {searchResults.courses.length > 0 && (
                  <View>
                    <Text style={styles.sectionTitle}>Courses:</Text>
                    {searchResults.courses.slice(0, 3).map((course, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.courseItem]}
                        onPress={() => {
                          console.log('Navigating to CourseDetail with ID:', course._id);
                          navigation.navigate('CourseDetail', { id: course._id });
                        }}
                      >
                        <Image
                          source={{ uri: course.image }}
                          style={styles.courseImage}
                        />
                        <Text style={styles.courseText}>{course.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Bundles list */}
                {searchResults.bundles.length > 0 && (
                  <View>
                    <Text style={styles.sectionTitle}>Bundles:</Text>
                    {searchResults.bundles.slice(0, 1).map((bundle, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.courseItem}
                        onPress={() => {
                          console.log('Navigating to BundleDetail with ID:', bundle._id);
                          navigation.navigate('BundleDetail', { id: bundle._id });
                        }}
                      >
                        <Image
                          source={{ uri: bundle.image }}
                          style={styles.courseImage}
                        />
                        <Text style={styles.courseText}>{bundle.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* No results message */}
                {searchResults.courses.length === 0 && searchResults.bundles.length === 0 && (
                  <Text style={styles.noResultsText}>No results found</Text>
                )}
              </>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 40, // Ensure space for "x" button
    borderRadius: 25,
    backgroundColor: "#f9f9f9",
    flex: 1,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButton: {
    position: "absolute",
    right: 15,
  },
  searchButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsContainer: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  courseItem: {
    flexDirection: "row", // Row direction for items
    alignItems: "center", // Center vertically
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  courseImage: {
    width: 50,
    height: 50,
    borderRadius: 5, // Round corners for image
    marginRight: 10,
  },
  courseText: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "grey",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
});

export default Search;
