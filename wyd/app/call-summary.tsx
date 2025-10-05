import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';

export default function CallSummaryScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ImageBB API configuration
  const IMAGEBB_API_KEY = Constants.expoConfig?.extra?.IMAGEBB_API_KEY || '';

  // ✅ Upload image to imgbb and return the hosted URL
  const uploadToImageBB = async (imageUri: string): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const uploadedImageUrl = data.data.url;
        setImageUrl(uploadedImageUrl);
        console.log('✅ Image uploaded to imgbb:', uploadedImageUrl);
        Alert.alert('Success!', 'Image uploaded successfully!');
        return uploadedImageUrl;
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Send the image URL (or empty string) to your backend
  const sendToBackend = async (imgurUrl: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8000/entries/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imgur_url: imgurUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      console.log('✅ Sent to backend:', imgurUrl);
      Alert.alert('Done!', 'Entry uploaded successfully!');
      router.push('/(tabs)/entries');
    } catch (error) {
      console.error('Backend upload failed:', error);
      Alert.alert('Error', 'Failed to save entry to backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      await uploadToImageBB(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      await uploadToImageBB(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Select Image', 'Choose how you want to add a photo', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // ✅ “No” button sends empty string
  const handleNoThanks = async () => {
    await sendToBackend('');
  };

  // ✅ “Continue” sends uploaded image URL
  const handleContinue = async () => {
    if (!imageUrl) {
      Alert.alert('Hold up', 'Please upload a photo first!');
      return;
    }
    await sendToBackend(imageUrl);
  };

  return (
    <View className="flex-1 bg-gray-50 px-8">
      <View className="flex-1 justify-center items-center">
        <Text className="text-4xl font-bold text-secondary text-center mb-16 leading-tight">
          would you like{'\n'}to add a photo{'\n'}from your{'\n'}day?
        </Text>

        <TouchableOpacity
          onPress={showImageOptions}
          className="w-80 h-80 border-2 border-dashed border-gray-400 rounded-3xl items-center justify-center"
          disabled={isUploading || isSubmitting}
        >
          {isUploading ? (
            <View className="items-center">
              <ActivityIndicator size="large" color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4">Uploading...</Text>
            </View>
          ) : selectedImage ? (
            <Image source={{ uri: selectedImage }} className="w-full h-full rounded-3xl" resizeMode="cover" />
          ) : (
            <AntDesign name="camera" size={80} color="#9CA3AF" />
          )}
        </TouchableOpacity>

        {imageUrl && (
          <View className="absolute bottom-12">
            <Text className="text-green-600 font-semibold text-center text-lg">Photo uploaded!</Text>
          </View>
        )}
      </View>

      <View className="pb-12">
        <View className="flex-row justify-between mx-4 mb-6">
          <TouchableOpacity
            onPress={handleNoThanks}
            disabled={isSubmitting}
            className="bg-gray-400 h-32 w-32 rounded-full items-center justify-center"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg text-center">No</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContinue}
            disabled={!imageUrl || isSubmitting}
            className={`h-32 w-32 rounded-full bg-green-700 items-center justify-center ${
              !imageUrl ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <MaterialIcons name="navigate-next" size={48} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <View className="items-center">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/entries')}
            className="bg-red-400 h-16 w-16 rounded-full items-center justify-center"
          >
            <EvilIcons name="trash" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
