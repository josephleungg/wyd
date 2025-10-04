import { Image } from 'expo-image';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function WrappedScreen() {
  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="pt-16 pb-8 px-6 bg-primary">
          <View className="items-center mb-6">
            <Image
              source={require('../../assets/images/wyd_logo.png')}
              style={{ width: 80, height: 80 }}
              className="mb-4"
            />
            <Text className="text-2xl font-bold text-secondary text-center">
              Your Week Wrapped
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Discover insights from your conversations
            </Text>
          </View>
        </View>

        {/* Stats Cards - Alternating Layout */}
        <View className="px-6 pb-8">
          
          {/* Left Aligned Card */}
          <View className="mb-6">
            <View className="bg-white rounded-2xl p-6 shadow-sm mr-12">
              <Text className="text-4xl font-bold text-tertiary mb-2">127</Text>
              <Text className="text-secondary font-medium">
                minutes of conversations this week
              </Text>
            </View>
          </View>

          {/* Right Aligned Card */}
          <View className="mb-6">
            <View className="bg-white rounded-2xl p-6 shadow-sm ml-12">
              <Text className="text-4xl font-bold text-tertiary mb-2">2,847</Text>
              <Text className="text-secondary font-medium">
                words spoken. That's longer than a short story!
              </Text>
            </View>
          </View>

          {/* Left Aligned Card */}
          <View className="mb-6">
            <View className="bg-white rounded-2xl p-6 shadow-sm mr-12">
              <Text className="text-2xl font-bold text-secondary mb-3">
                Most Used Word
              </Text>
              <Text className="text-5xl font-bold text-tertiary mb-2">"amazing"</Text>
              <Text className="text-gray-600">
                Used 23 times this week
              </Text>
            </View>
          </View>

          {/* Right Aligned Card */}
          <View className="mb-6">
            <View className="bg-white rounded-2xl p-6 shadow-sm ml-12">
              <Text className="text-2xl font-bold text-secondary mb-3">
                Mood Breakdown
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">😊 Positive</Text>
                  <Text className="font-bold text-secondary">68%</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">😐 Neutral</Text>
                  <Text className="font-bold text-secondary">24%</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">😔 Negative</Text>
                  <Text className="font-bold text-secondary">8%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Left Aligned Card */}
          <View className="mb-6">
            <View className="bg-white rounded-2xl p-6 shadow-sm mr-12">
              <Text className="text-2xl font-bold text-secondary mb-3">
                Conversation Topics
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="bg-primary px-3 py-1 rounded-full">
                  <Text className="text-secondary text-sm">work</Text>
                </View>
                <View className="bg-primary px-3 py-1 rounded-full">
                  <Text className="text-secondary text-sm">friends</Text>
                </View>
                <View className="bg-primary px-3 py-1 rounded-full">
                  <Text className="text-secondary text-sm">goals</Text>
                </View>
                <View className="bg-primary px-3 py-1 rounded-full">
                  <Text className="text-secondary text-sm">travel</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Aligned Card - Quote */}
          <View className="mb-6">
            <View className="bg-tertiary rounded-2xl p-6 shadow-sm ml-12">
              <Text className="text-3xl text-white mb-3">"</Text>
              <Text className="text-white text-lg italic mb-3">
                I want to be more intentional with my time and really focus on what matters.
              </Text>
              <Text className="text-pink-200 text-sm">
                - You, on Tuesday
              </Text>
            </View>
          </View>

          {/* Full Width Summary Card */}
          <View className="mb-8">
            <View className="bg-secondary rounded-2xl p-6 shadow-sm">
              <Text className="text-2xl font-bold text-white mb-3">
                This Week's Insight
              </Text>
              <Text className="text-gray-200 text-lg leading-relaxed">
                You've been reflecting a lot on personal growth and making meaningful connections. 
                Your conversations show a clear focus on building better habits and being more present 
                in your daily life.
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}