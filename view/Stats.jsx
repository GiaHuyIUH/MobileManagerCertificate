import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { REACT_APP_API_BASE_URL } from "../utils/constant";

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_BASE_URL}/stats/user-stats/${user._id}`);
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{`Error: ${error}`}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Statistics</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Total Enrollments</Text>
        <Text style={styles.statValue}>{stats.totalEnrollments}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Total Certificates</Text>
        <Text style={styles.statValue}>{stats.totalCertificates}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Total Bundle Certificates</Text>
        <Text style={styles.statValue}>{stats.totalBundleCertificates}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Average Score</Text>
        <Text style={styles.statValue}>{stats.avgScore.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  statTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Stats;
