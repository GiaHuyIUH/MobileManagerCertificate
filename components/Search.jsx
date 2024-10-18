import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather"; // Biểu tượng "x"

const Search = () => {
  const [query, setQuery] = useState("");

  const handleInputChange = (text) => {
    setQuery(text);
  };

  const handleSearch = () => {
    // Thực hiện logic tìm kiếm ở đây
    console.log("Searching for:", query);
  };

  const clearInput = () => {
    setQuery("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleInputChange}
          placeholder="Search..."
          placeholderTextColor="#999"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <Feather name="x-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <AntDesign name="search1" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    paddingRight: 40, // Đảm bảo khoảng trống cho nút "x"
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
});

export default Search;
