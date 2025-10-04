import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function EntriesScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample data with sentiment
  const allEntries = [
    { id: 1, title: "Today's Reflection", content: "Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things Had a great day learning new things", date: "Oct 4, 2025", sentiment: "positive", type: "goals" },
    { id: 2, title: "Morning Thoughts", content: "Woke up feeling energized and ready to tackle the day...", date: "Oct 3, 2025", sentiment: "positive", type: "thoughts" },
    { id: 3, title: "Evening Gratitude", content: "Grateful for the people in my life and the opportunities...", date: "Oct 2, 2025", sentiment: "positive", type: "gratitude" },
    { id: 4, title: "Weekend Vibes", content: "Spent quality time with family and friends...", date: "Oct 1, 2025", sentiment: "positive", type: "social" },
    { id: 5, title: "Work Insights", content: "Learned something valuable about teamwork today...", date: "Sep 30, 2025", sentiment: "neutral", type: "work" },
    { id: 6, title: "Personal Growth", content: "Reflecting on how much I've grown this year...", date: "Sep 29, 2025", sentiment: "positive", type: "growth" },
    { id: 7, title: "Tough Day", content: "Today was challenging and I felt overwhelmed with everything...", date: "Sep 28, 2025", sentiment: "negative", type: "challenges" },
    { id: 8, title: "Regular Tuesday", content: "Nothing special happened today, just a normal routine...", date: "Sep 27, 2025", sentiment: "neutral", type: "routine" },
    { id: 9, title: "Feeling Down", content: "Struggling with some personal issues and feeling quite low...", date: "Sep 26, 2025", sentiment: "negative", type: "emotions" },
    { id: 10, title: "Celebration Time", content: "Got promoted at work today! So excited and proud of myself...", date: "Sep 25, 2025", sentiment: "positive", type: "achievements" },
    { id: 11, title: "Rainy Day Thoughts", content: "Weather is gloomy and matching my mood today...", date: "Sep 24, 2025", sentiment: "negative", type: "emotions" },
  ];

  // Filter entries based on selected filter
  const entries = selectedFilter === 'all' 
    ? allEntries 
    : allEntries.filter(entry => entry.sentiment === selectedFilter);

  // Helper function to truncate text to first 20 words
  const truncateToWords = (text, wordCount = 20) => {
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  return (
    <View className="flex-1 bg-white">

      <View className="flex-row items-center px-6 pb-6 pt-16">
        <Image
          source={require('@/assets/images/entries_icon.png')}
          className="w-16 h-16 -rotate-90 mr-1"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-secondary">entries</Text>
      </View>

      {/* ScrollView with primary background */}
      <ScrollView 
        className="flex-1 bg-primary rounded-t-[64px] pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Filter Buttons inside ScrollView */}
        <View className="my-6 flex items-center">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <TouchableOpacity
              onPress={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'all' ? 'bg-secondary' : 'bg-white/80'}`}
            >
              <Text className={`font-medium ${selectedFilter === 'all' ? 'text-white' : 'text-secondary'}`}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter('positive')}
              className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'positive' ? 'bg-secondary' : 'bg-white/80'}`}
            >
              <Text className={`font-medium ${selectedFilter === 'positive' ? 'text-white' : 'text-secondary'}`}>😊 Positive</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter('neutral')}
              className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'neutral' ? 'bg-secondary' : 'bg-white/80'}`}
            >
              <Text className={`font-medium ${selectedFilter === 'neutral' ? 'text-white' : 'text-secondary'}`}>😐 Neutral</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter('negative')}
              className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'negative' ? 'bg-secondary' : 'bg-white/80'}`}
            >
              <Text className={`font-medium ${selectedFilter === 'negative' ? 'text-white' : 'text-secondary'}`}>😔 Negative</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Entries */}
        {entries.map((entry) => (
          <View key={entry.id} className="mt-8 mx-4">

            {/* Sentiment Tags */}
            <View className="flex-row mb-2 px-2">
              <View className="bg-secondary px-3 py-1 rounded-full mr-2">
                <Text className="text-white text-sm font-medium">{entry.sentiment}</Text>
              </View>
              <View className="bg-secondary px-3 py-1 rounded-full">
                <Text className="text-white text-sm font-medium">goals</Text>
              </View>
            </View>

            {/* White Card Container */}
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: "/entry/[id]",
                params: {
                  id: entry.id,
                  title: entry.title,
                  content: entry.content,
                  date: entry.date,
                  sentiment: entry.sentiment,
                  type: entry.type
                }
              })}
              className="bg-white p-6 rounded-3xl shadow-sm border-l-[6px] border-secondary"
            >
              {/* content */}
              <Text className="text-lg font-bold text-secondary mb-3">{entry.date}</Text>
              <Text className="text-gray-700 leading-6 text-base">{truncateToWords(entry.content)}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
