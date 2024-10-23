import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const NotFound = ({ navigation }) => {
  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>Trang bạn tìm kiếm không tồn tại.</Text>
      <Button title="Quay lại Trang Chính" onPress={handleGoHome} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default NotFound;
