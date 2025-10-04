import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';

const Chat = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(prev => prev + 1);
      setIsClosing(false);
    }, [])
  );

  const handleEndChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.push('/call-summary');
    }, 600); // delay slightly longer for color fade
  };

  const handleCancel = () => {
    router.push('/entries');
  };

  return (
    <View className='flex-1 bg-secondary'>
      <AnimatePresence>
        {!isClosing && (
          <MotiView
            key={animationKey}
            from={{ opacity: 0, scale: 0.9, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
            className='flex-1'
          >
            {/* Cancel button with margin */}
            <View className='pt-16 pl-6'>
              <TouchableOpacity
                className='bg-white/20 rounded-full p-3 self-start mt-8 ml-4'
                onPress={handleCancel}
              >
                <MaterialCommunityIcons
                  name='close'
                  size={24}
                  color='white'
                />
              </TouchableOpacity>
            </View>

            {/* Main content */}
            <View className='flex-1 justify-center items-center'>
              <View className='justify-around items-center h-2/3'>
                <Text className='text-white font-semibold text-6xl'>wyd?</Text>

                <TouchableOpacity
                  className='bg-red-600 p-7 rounded-full'
                  onPress={handleEndChat}
                >
                  <MaterialCommunityIcons
                    name='phone-hangup-outline'
                    size={36}
                    color='white'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </MotiView>
        )}
      </AnimatePresence>

      {/* Fade-to-entries background */}
      {isClosing && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 500 }}
          style={{
            position: 'absolute',
            backgroundColor: '#FFFFFF',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      )}
    </View>
  );
};

export default Chat;
