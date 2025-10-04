import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';

export default function EntryDetailScreen() {
  const { id, title, content, date, sentiment, type, image } = useLocalSearchParams();

  // Convert params to proper types
  const entry = {
    id: parseInt(id as string),
    title: title as string,
    content: content as string,
    date: date as string,
    sentiment: sentiment as string,
    type: type as string,
    image: image as string
  };

  if (!entry.id || !entry.title) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-6">
        <Text className="text-xl text-secondary">Entry not found</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-secondary px-6 py-3 rounded-full mt-4"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-24 pb-12 px-6">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <AntDesign name="left" size={20} color="#B85C71" />
          <Text className="text-tertiary font-bold"> back to all entries</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1 pt-6"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        {entry.image ? (
          <Image
            source={typeof entry.image === 'string' ? { uri: entry.image } : entry.image}
            style={{
              width: '100%',       // full width of ScrollView content
              height: 400,         // fixed height, adjust as needed
              borderRadius: 12,    // optional: rounded corners
              marginBottom: 20,    // spacing below image
            }}
            resizeMode="cover"
          />
        ) : ''}

        {/* Tags */}
        <View className="flex-row mb-6">
          <View className="bg-secondary px-4 py-2 rounded-full mr-3">
            <Text className="text-white font-medium">{entry.sentiment}</Text>
          </View>
          <View className="bg-secondary px-4 py-2 rounded-full">
            <Text className="text-white font-medium">{entry.type}</Text>
          </View>
        </View>

        {/* Title & Date */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-secondary mb-2">{entry.title}</Text>
          <View className="flex-row items-center">
            <Text className={`text-2xl mr-3 ${getSentimentColor(entry.sentiment)}`}>
              {getSentimentEmoji(entry.sentiment)}
            </Text>
            <Text className="text-lg text-gray-600">{entry.date}</Text>
          </View>
        </View>

        {/* Content */}
        <View className="border-l-4 border-secondary pl-6 mb-8">
          <Text className="text-gray-700 leading-7 text-base">{entry.content}</Text>
        </View>

        {/* Transcript Button */}
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: "/transcript/[id]",
            params: { id: entry.id, title: entry.title }
          })}
          className="bg-tertiary px-6 py-4 rounded-full mx-4 mb-6"
        >
          <Text className="text-white text-center font-semibold text-lg">View Full Transcript</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Feathered Gradient Overlay - Right below header, above scrollable content */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)']}
        style={{
          position: 'absolute',
          top: 144, // Position exactly at the end of header section (pt-24 + pb-12 = 144px from top)
          left: 0,
          right: 0,
          height: 30,
          pointerEvents: 'none', // Allow touches to pass through
        }}
      />
        
    </View>
  );
}