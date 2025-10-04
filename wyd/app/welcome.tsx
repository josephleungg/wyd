import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

const WelcomePage = () => {
  const handleEnterApp = () => {
    router.push('/(tabs)/entries');
  };

  return (
    <View className="flex-1 bg-white p-5">
      <View className="flex-1 justify-center pt-32">
        <Image
        source={require('@/assets/images/wyd_logo.png')}
        className="w-72 h-72"
        resizeMode="contain"
        />
        <View className="pr-12 pl-4">
          <Text className="text-3xl font-bold mt-16">Welcome!</Text>
          <Text className="text-lg text-gray-600 mt-2">ready to journal without lifting a finger? we just need a few things to get started.</Text>
        </View>
      </View>

      <View className="flex-row justify-end pb-8">
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={handleEnterApp}
        >
          <Text className="text-black text-lg font-semibold mr-4">Continue</Text>
          <View className="bg-red-400 w-12 h-12 rounded-full items-center justify-center">
            <Text className="text-white text-xl font-bold">→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomePage;