import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useState } from 'react';
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

export default function EntriesNewScreen() {
  // Function to shorten text to 7 words and add '...'
  const get_shortened_content = (text: string): string => {
    const words = text.split(' ');
    if (words.length <= 7) return text;
    return words.slice(0, 7).join(' ') + '...';
  };

  // Sample data matching the dates from the image
  const entries: Entry[] = [
    { 
      id: 1, 
      date: "Oct 6, 2025", 
      image: "https://instagram.fyto1-1.fna.fbcdn.net/v/t51.2885-15/524942146_17883656229343832_5204194212605521265_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08_tt6&_nc_ht=instagram.fyto1-1.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2QEpcryhEFrU-jUiCXZloh78fHG9wZLaTqOF8urzBHgPNhSqmqoMcG4gAyE7-iZUEcabQimt7C2oihW-PIBjjS77&_nc_ohc=y6Dykhfa3hcQ7kNvwHaepRI&_nc_gid=mpZXa3uZkw93O99PrYGAWg&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfeMyZOilHChBDLRXPtB2nPoFApK--o1KR2K6AxxcVDhdA&oe=68E7776D&_nc_sid=8b3546", // Using your first JPG image
      fullContent: "Today was such a beautiful day! I captured this amazing moment that really made me reflect on how grateful I am for the little things in life. Sometimes the best memories come from the most unexpected places.",
      content: get_shortened_content("Today was such a beautiful day! I captured this amazing moment that really made me reflect on how grateful I am for the little things in life. Sometimes the best memories come from the most unexpected places."),
      type: "gratitude",
      sentiment: "positive"
    },
    { 
      id: 2, 
      date: "Oct 5, 2025", 
      image: "https://instagram.fyto1-1.fna.fbcdn.net/v/t51.29350-15/472263951_876024514425101_1105479332412899958_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=instagram.fyto1-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QEpcryhEFrU-jUiCXZloh78fHG9wZLaTqOF8urzBHgPNhSqmqoMcG4gAyE7-iZUEcabQimt7C2oihW-PIBjjS77&_nc_ohc=VWupxIX1yRMQ7kNvwEZsXx1&_nc_gid=mpZXa3uZkw93O99PrYGAWg&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AffKFmbafAMpsRtCfZW9i-yWh8ET74Bq7vKK1coY4mCs9g&oe=68E75D45&_nc_sid=8b3546", // Using your second JPG image
      fullContent: "Had an incredible experience today that I wanted to remember forever. This photo captures exactly how I was feeling - peaceful, content, and truly present in the moment.",
      content: get_shortened_content("Had an incredible experience today that I wanted to remember forever. This photo captures exactly how I was feeling - peaceful, content, and truly present in the moment."),
      type: "reflection",
      sentiment: "positive"
    },
    { 
      id: 3, 
      date: "Oct 4, 2025", 
      image: "", // placeholder for photo URL
      fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed vestibulum nulla, eu tincidunt nulla.",
      content: get_shortened_content("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed vestibulum nulla, eu tincidunt nulla."),
      type: "thoughts",
      sentiment: "neutral"
    },
    { 
      id: 4, 
      date: "Oct 3, 2025", 
      image: "https://instagram.fyto1-2.fna.fbcdn.net/v/t51.29350-15/467654538_868696888669939_9122512832380238266_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_ht=instagram.fyto1-2.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QEUwL6PWsE3S9ISRuAGnyBfS4wUBovOy2y2dEIQEpHrstYP-mK7AUyr2aZSlylTdW6HOqYdFHaEupPevw06W91G&_nc_ohc=8H5F-yeAMbsQ7kNvwGXjQtG&_nc_gid=cJDrd_2nqSHYzbyZkjhKxA&edm=APU89FABAAAA&ccb=7-5&ig_cache_key=MzUwNDQ2NzcyMjc4OTk1NjczOA%3D%3D.3-ccb7-5&oh=00_Afc0-PXd6RVRb9LoSLDi5IC7Utuk-lUZs5vVyzIIxyi8Wg&oe=68E76A4B&_nc_sid=bc0c2c", // placeholder for photo URL
      fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed vestibulum nulla, eu tincidunt nulla.",
      content: get_shortened_content("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed vestibulum nulla, eu tincidunt nulla."),
      type: "routine",
      sentiment: "neutral"
    },
    { 
      id: 5, 
      date: "Oct 4, 2025", 
      image: "", // placeholder for photo URL
      fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed vestibulum nulla.",
      content: get_shortened_content("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed vestibulum nulla."),
      type: "work",
      sentiment: "positive"
    },
    { 
      id: 6, 
      date: "Oct 2, 2025", 
      image: "", // placeholder for photo URL
      fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed vestibulum nulla, eu tincidunt nulla.",
      content: get_shortened_content("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed vestibulum nulla, eu tincidunt nulla."),
      type: "challenges",
      sentiment: "negative"
    }
  ];

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
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

