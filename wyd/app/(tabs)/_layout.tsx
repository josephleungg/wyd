import { Tabs } from 'expo-router';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    // this is the navbar
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#B85C71",
        tabBarInactiveTintColor: "#191E44",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#E6B2AE",
          paddingTop: 10,
          height: 90,
        }
      }}>
      <Tabs.Screen
        name="entries"
        options={{
          title: 'entries',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-grid" size={28} color={color} />
          ),
          tabBarLabelStyle: {
            marginTop: 5,
            fontSize: 10,
            color: '#191E44'
          }
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '',
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: '#191E44',
                width: 80,
                height: 80,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -40,
              }}
            >
              <MaterialCommunityIcons
                name="phone-hangup-outline"
                size={28}
                color="white"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wrapped"
        options={{
          title: 'wrapped',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-outline" size={28} color={color} />
          ),
          tabBarLabelStyle: {
            marginTop: 5,
            fontSize: 10,
            color: '#191E44'
          },
        }}
      />
    </Tabs>
  );
}
