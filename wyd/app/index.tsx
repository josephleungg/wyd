import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

const HomePage = () => {
  const handleEnterApp = () => {
    router.push('/welcome');
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-5">      
      <TouchableOpacity className="" onPress={handleEnterApp}>
        <Image
        source={require('@/assets/images/wyd_logo.png')}
        className="w-48 h-48"
        resizeMode="contain"
      />
      </TouchableOpacity>
    </View>
  );
};

export default HomePage;