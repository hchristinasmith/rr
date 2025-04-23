import React from 'react';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  // Mock data for demonstration
  const weatherData = {
    temperature: -2,
    condition: 'Snowing',
    snowDepth: '120cm',
    newSnow: '15cm',
    forecast: 'Light snow expected throughout the day'
  };

  const resortInfo = {
    name: 'Coronet Peak',
    status: 'Open',
    liftStatus: '8/9 lifts open',
    trailStatus: '27/30 trails open'
  };
  
  // NZSki resorts
  const nzSkiResorts = [
    {
      id: 1,
      name: 'Coronet Peak',
      status: 'Open',
      color: '#0033a0' // NZSki blue
    },
    {
      id: 2,
      name: 'The Remarkables',
      status: 'Open',
      color: '#004dc9' // Lighter blue
    },
    {
      id: 3,
      name: 'Mt Hutt',
      status: 'Open',
      color: '#002577' // Darker blue
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Resort Header */}
      <View style={styles.header}>
        <Text style={styles.resortName}>{resortInfo.name}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: resortInfo.status === 'Open' ? '#4CAF50' : '#F44336' }]}>
            {resortInfo.status}
          </Text>
        </View>
      </View>

      {/* Weather Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Conditions</Text>
        <View style={styles.weatherContainer}>
          <View style={styles.weatherMain}>
            <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
            <Text style={styles.condition}>{weatherData.condition}</Text>
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetail}>
              <Ionicons name="snow-outline" size={24} color="#0033a0" />
              <Text style={styles.detailText}>Snow Depth: {weatherData.snowDepth}</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="trending-down-outline" size={24} color="#0033a0" />
              <Text style={styles.detailText}>New Snow: {weatherData.newSnow}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.forecast}>{weatherData.forecast}</Text>
      </View>

      {/* Resort Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resort Status</Text>
        <View style={styles.statusRow}>
          <Ionicons name="git-branch-outline" size={24} color="#0033a0" />
          <Text style={styles.statusRowText}>{resortInfo.liftStatus}</Text>
        </View>
        <View style={styles.statusRow}>
          <Ionicons name="trail-sign-outline" size={24} color="#0033a0" />
          <Text style={styles.statusRowText}>{resortInfo.trailStatus}</Text>
        </View>
      </View>

      {/* Quick Access Buttons */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity style={styles.quickAccessButton}>
          <Ionicons name="videocam-outline" size={32} color="#0033a0" />
          <Text style={styles.quickAccessText}>Live Cams</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessButton}>
          <Ionicons name="map-outline" size={32} color="#0033a0" />
          <Text style={styles.quickAccessText}>Trail Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessButton}>
          <Ionicons name="ticket-outline" size={32} color="#0033a0" />
          <Text style={styles.quickAccessText}>Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessButton}>
          <Ionicons name="time-outline" size={32} color="#0033a0" />
          <Text style={styles.quickAccessText}>Lift Times</Text>
        </TouchableOpacity>
      </View>

      {/* NZSki Resorts */}
      <Text style={styles.sectionTitle}>Our Resorts</Text>
      <View style={styles.resortsContainer}>
        {nzSkiResorts.map(resort => (
          <TouchableOpacity key={resort.id} style={styles.resortCard}>
            <View style={[styles.resortImagePlaceholder, { backgroundColor: resort.color }]}>
              <Text style={styles.resortImageText}>{resort.name}</Text>
            </View>
            <View style={styles.resortCardContent}>
              <Text style={styles.resortCardTitle}>{resort.name}</Text>
              <View style={[styles.resortStatusBadge, { backgroundColor: resort.status === 'Open' ? '#4CAF50' : '#F44336' }]}>
                <Text style={styles.resortStatusText}>{resort.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Today's Highlights */}
      <Text style={styles.sectionTitle}>Today's Highlights</Text>
      <View style={styles.highlightsContainer}>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Fresh Powder Alert!</Text>
          <Text style={styles.highlightDesc}>15cm of new snow overnight. Best conditions on Coronet Peak.</Text>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Lodge Special</Text>
          <Text style={styles.highlightDesc}>20% off hot chocolate at Coronet Base until 11am.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resortName: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: 'white',
  },
  statusContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Montserrat_600SemiBold',
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
    marginBottom: 10,
    color: '#333',
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherMain: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 36,
    fontFamily: 'Montserrat_700Bold',
    color: '#0033a0',
  },
  condition: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#666',
  },
  weatherDetails: {
    flex: 1,
    marginLeft: 20,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#666',
  },
  forecast: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#666',
    fontStyle: 'italic',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusRowText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    margin: 10,
    marginTop: 20,
    color: '#333',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 5,
  },
  quickAccessButton: {
    backgroundColor: 'white',
    width: '48%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickAccessText: {
    marginTop: 5,
    color: '#333',
    fontFamily: 'Montserrat_500Medium',
  },
  highlightsContainer: {
    padding: 5,
  },
  highlightCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  highlightTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 5,
    color: '#0033a0',
  },
  highlightDesc: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#666',
  },
  resortsContainer: {
    padding: 5,
  },
  resortCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  resortImagePlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resortImageText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
  },
  resortCardContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resortCardTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#333',
  },
  resortStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  resortStatusText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
  },
});

export default HomeScreen;
