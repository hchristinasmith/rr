import React from 'react';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  // Mock user data
  const userData = {
    name: 'Hannah Smith',
    email: 'hannah@example.com',
    memberSince: 'January 2023',
    favoriteResort: 'Alpine Peak Resort',
    seasonPasses: ['Alpine Peak Season Pass'],
    stats: {
      daysSkied: 28,
      verticalMeters: 45200,
      topSpeed: 72,
      totalRuns: 142
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person-circle" size={100} color="#0066cc" />
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.memberSince}>Member since {userData.memberSince}</Text>
      </View>

      {/* Season Passes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Season Passes</Text>
        {userData.seasonPasses.map((pass, index) => (
          <View key={index} style={styles.passItem}>
            <Ionicons name="ticket-outline" size={24} color="#0066cc" />
            <Text style={styles.passText}>{pass}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Passes</Text>
        </TouchableOpacity>
      </View>

      {/* Season Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Season Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.daysSkied}</Text>
            <Text style={styles.statLabel}>Days Skied</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.verticalMeters.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Vertical Meters</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.topSpeed}</Text>
            <Text style={styles.statLabel}>Top Speed (km/h)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.totalRuns}</Text>
            <Text style={styles.statLabel}>Total Runs</Text>
          </View>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#0066cc" />
          <Text style={styles.settingText}>Notification Preferences</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="lock-closed-outline" size={24} color="#0066cc" />
          <Text style={styles.settingText}>Privacy Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="map-outline" size={24} color="#0066cc" />
          <Text style={styles.settingText}>Resort Preferences</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle-outline" size={24} color="#0066cc" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#666',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#999',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 15,
    color: '#333',
  },
  passItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  passText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#333',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#0033a0',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
  },
});

export default ProfileScreen;
