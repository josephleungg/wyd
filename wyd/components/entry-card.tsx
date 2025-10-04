import { Text, View, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface Entry {
  id: number;
  date: string;
  image: string | number; // url to the photo or require() asset
  fullContent: string;
  content: string;
}

interface EntryCardProps {
  item: Entry;
  cardWidth: number;
}

export default function EntryCard({ item, cardWidth }: EntryCardProps) {
  // Random background colors for cards without images
  const backgroundColors = ['#d2de9b', '#bb5c72', '#ab94b7', '#c0c8e0', '#b2dccf'];
  
  const getRandomBackgroundColor = (id: number) => {
    // Use the entry ID to consistently assign the same color to the same entry
    return backgroundColors[id % backgroundColors.length];
  };

  const handlePress = () => {
    router.push({
      pathname: "/entry/[id]",
      params: {
        id: item.id,
        content: item.fullContent,
        date: item.date
      }
    });
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="mb-4 overflow-hidden"
      style={{ 
        width: cardWidth,
        borderWidth: 1,
        borderColor: '#f3f4f6' // very light gray
      }}
    >
      {/* Image or colored background area */}
      <View 
        className="h-48 w-full" 
        style={{ 
          backgroundColor: item.image ? 'transparent' : getRandomBackgroundColor(item.id)
        }}
      >
        {item.image ? (
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : null}
      </View>
      
      {/* Content area */}
      <View className="bg-white p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          {item.date}
        </Text>
        <Text className="text-sm text-gray-600 leading-5">
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
}