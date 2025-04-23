import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';

// Import placeholder screens
import HomeScreen from './src/screens/HomeScreen';
import WebcamsScreen from './src/screens/WebcamsScreen';
import MapsScreen from './src/screens/MapsScreen';
import TicketsScreen from './src/screens/TicketsScreen';
import FoodScreen from './src/screens/FoodScreen';
import LiftsScreen from './src/screens/LiftsScreen';
import StatsScreen from './src/screens/StatsScreen';
import SocialScreen from './src/screens/SocialScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Custom header with drawer toggle and profile icon
function CustomHeader({ navigation, title, canGoBack = false }) {
  return (
    <View style={styles.header}>
      {canGoBack ? (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.iconContainer}
        >
          <Ionicons name="arrow-back" size={32} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
          style={styles.iconContainer}
        >
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      
      <View style={styles.logoContainer}>
        {/* Temporary NZSki logo using text - replace with actual image later */}
        <Text style={styles.logoText}>NZSki</Text>
      </View>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Profile')}
        style={styles.iconContainer}
      >
        <Ionicons name="person-circle" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// Bottom Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Maps':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Social':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Lifts':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Food':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={26} color={color} />;
        },
        tabBarActiveTintColor: '#0033a0', // NZSki blue
        tabBarInactiveTintColor: 'gray',
        header: ({ navigation, route, options }) => {
          // For tab screens, we don't show back button since they're root level
          return <CustomHeader navigation={navigation} title={route.name} canGoBack={false} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Maps" component={MapsScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Lifts" component={LiftsScreen} />
      <Tab.Screen name="Food" component={FoodScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar style="light" />
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            width: 280,
          },
          drawerLabelStyle: {
            fontSize: 16,
          },
          drawerActiveBackgroundColor: '#e6f0ff',
          drawerActiveTintColor: '#0033a0', // NZSki blue
          headerShown: false,
        }}
      >
        <Drawer.Screen 
          name="TabNavigator" 
          component={TabNavigator} 
          options={{
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={26} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Webcams" 
          component={WebcamsScreen} 
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="videocam-outline" size={26} color={color} />
            ),
            header: ({ navigation }) => (
              <CustomHeader navigation={navigation} title="Webcams" canGoBack={true} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Tickets" 
          component={TicketsScreen} 
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="ticket-outline" size={26} color={color} />
            ),
            header: ({ navigation }) => (
              <CustomHeader navigation={navigation} title="Tickets" canGoBack={true} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Stats" 
          component={StatsScreen} 
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={26} color={color} />
            ),
            header: ({ navigation }) => (
              <CustomHeader navigation={navigation} title="Stats" canGoBack={true} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={26} color={color} />
            ),
            header: ({ navigation }) => (
              <CustomHeader navigation={navigation} title="Profile" canGoBack={true} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0033a0', // NZSki blue
    height: 60,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
  },
});
