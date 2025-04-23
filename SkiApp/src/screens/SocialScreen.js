import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const SocialScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social & Community Features</Text>
      <Text style={styles.subtitle}>Connect with friends and share your skiing experience</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0066cc',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SocialScreen;
