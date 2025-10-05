import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import EntryCard from '@/components/entry-card';

// HI. JESSIE WAS HERE HI JESSIE WAS HERE HI JESSIE WAS HERE LOL IM SO TIRED I HAVE TO
// GO TO WORK SOOOONN

interface Entry {
  id: number;
  date: string;
  image: string | number; // url to the photo or require() asset
  fullContent: string;
  content: string; // shortened content for display
  type: string;
  sentiment: string;
}

interface ApiEntry {
  id: number;
  content: string;
  timestamp: string;
  sentiment: string;
  type: string;
  owner_id: null | number;
  conversation_id: string;
  imgur_url: string;
}

export default function EntriesNewScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to shorten text to 7 words and add '...'
  const get_shortened_content = (text: string): string => {
    const words = text.split(' ');
    if (words.length <= 7) return text;
    return words.slice(0, 7).join(' ') + '...';
  };

  // Function to format timestamp to date string
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Function to fetch entries from API
  const fetchEntries = async () => {
    try {
      setLoading(true);
      
      console.log('Attempting to fetch from API...');
      const apiUrl = `http://${process.env.EXPO_PUBLIC_IP_ADDRESS || '172.20.10.7'}:8000/entries`;
      console.log('API URL:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiEntries: ApiEntry[] = await response.json();
      console.log('API response:', apiEntries);
      
      // Transform API data to match our Entry interface
      const transformedEntries: Entry[] = apiEntries.map(apiEntry => ({
        id: apiEntry.id,
        date: formatDate(apiEntry.timestamp),
        image: apiEntry.imgur_url || "", // Use imgur_url from API
        fullContent: apiEntry.content, // Use content from API
        content: get_shortened_content(apiEntry.content), // Shorten the content
        type: apiEntry.type,
        sentiment: apiEntry.sentiment
      }));
      
      setEntries(transformedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
      // Keep empty array if API fails
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48) / 2; // 48 for padding and gap

  const renderEntry = ({ item }: { item: Entry }) => (
    <EntryCard item={item} cardWidth={cardWidth} />
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 pb-6 pt-16">
        <Image
          source={require('@/assets/images/entries_icon.png')}
          className="w-16 h-16 -rotate-90 mr-1"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-secondary">entries</Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#9CA3AF" />
            <Text className="text-gray-500 mt-4">Loading entries...</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            renderItem={renderEntry}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}

