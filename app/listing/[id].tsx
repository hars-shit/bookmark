import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import itemList from '@/data/item.json';
import { ItemType } from '@/type/ItemType';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {};

const ItemDetails = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<ItemType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookmark, setBookmark] = useState<boolean>(false);

  const getItem = () => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    const result = itemList.find((item) => item.id === id);
    setItem(result);
    setIsLoading(false);
  };

  const saveBookmark = async (itemId: string) => {
    try {
      const token = await AsyncStorage.getItem('bookmark');
      const res = token ? JSON.parse(token) : [];

      if (res.includes(itemId)) {
        const updatedBookmarks = res.filter((id: string) => id !== itemId);
        await AsyncStorage.setItem('bookmark', JSON.stringify(updatedBookmarks));
        alert('Item Removed!');
        setBookmark(false);
      } else {
        res.push(itemId);
        await AsyncStorage.setItem('bookmark', JSON.stringify(res));
        alert('Item Saved!');
        setBookmark(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark', err);
    }
  };

  useEffect(() => {
    getItem();
    const checkBookmark = async () => {
      try {
        const token = await AsyncStorage.getItem('bookmark');
        const res = token ? JSON.parse(token) : [];
        if (res.includes(id)) {
          setBookmark(true);
        }
      } catch (err) {
        console.error('Error checking bookmark', err);
      }
    };
    checkBookmark();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => saveBookmark(id!)}>
              <Ionicons name={bookmark ? 'heart' : 'heart-outline'} color={bookmark ? 'red' : 'black'} size={22} />
            </TouchableOpacity>
          ),
          title: '',
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{item?.name}</Text>
        <View style={styles.newsInfoWrapper}>
          <Text style={styles.newsInfo}>{item?.location}</Text>
          <Text style={styles.newsInfo}>{item?.category}</Text>
        </View>
        <Image source={{ uri: item?.image || 'https://via.placeholder.com/300' }} style={styles.newsImg} />
        <Text style={styles.newsContent}>{item?.description}</Text>
      </ScrollView>
    </>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
    letterSpacing: 0.6,
  },
  newsImg: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  newsInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  newsInfo: {
    fontSize: 12,
    color: '#666',
  },
  newsContent: {
    fontSize: 14,
    color: '#555',
    letterSpacing: 0.8,
    lineHeight: 22,
  },
});
