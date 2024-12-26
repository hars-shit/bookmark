import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {


  return (
    <Tabs >
      <Tabs.Screen name='index' options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name='home-outline' size={24} color={color} />
        ), title: 'Home'
      }}
      />
        <Tabs.Screen name='bookmark' options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name='heart-outline' size={24} color={color} />
        ), title: 'Bookmark'
      }}
      />
    </Tabs>
  );
}
