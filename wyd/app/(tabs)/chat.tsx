import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Chat = () => {
  const handleEndChat = () => {
    router.push('/entries');
  };

  return (
    <View className='flex-1 items-center bg-secondary py-40'>
      <Text className='text-white top-0 font-semibold text-5xl'>wyd.</Text>
      <TouchableOpacity className='bottom-40 flex items-center bg-red-600 absolute p-6 rounded-full' onPress={handleEndChat}>
        <MaterialCommunityIcons
          name="phone-hangup-outline"
          size={32}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({})

export default Chat;
