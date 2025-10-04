import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CallSummaryScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imgurUrl, setImgurUrl] = useState<string | null>(null);

  // Imgur API configuration
  const IMGUR_CLIENT_ID = 'YOUR_IMGUR_CLIENT_ID'; // You'll need to replace this

  const uploadToImgur = async (imageUri: string): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        const imageUrl = data.data.link;
        setImgurUrl(imageUrl);
        Alert.alert('Success!', `Image uploaded successfully!\nURL: ${imageUrl}`);
        return imageUrl;
      } else {
        throw new Error(data.data?.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload image to Imgur. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      // Automatically upload after selection
      await uploadToImgur(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      // Automatically upload after taking photo
      await uploadToImgur(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNoThanks = () => {
    router.push('/(tabs)/entries');
  };

  const handleContinue = () => {
    // Navigate back to entries with the image URL if available
    router.push('/(tabs)/entries');
  };

  return (
    <View className="flex-1 bg-gray-50 px-8">
      {/* Main Content Container */}
      <View className="flex-1 justify-center items-center">
        
        {/* Question Text */}
        <Text className="text-4xl font-bold text-secondary text-center mb-16 leading-tight">
          would you like{'\n'}to add a photo{'\n'}from your{'\n'}day?
        </Text>

        {/* Photo Upload Area */}
        <TouchableOpacity
          onPress={showImageOptions}
          className="w-80 h-80 border-2 border-dashed border-gray-400 rounded-3xl items-center justify-center mb-20"
          disabled={isUploading}
        >
          {isUploading ? (
            <View className="items-center">
              <ActivityIndicator size="large" color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4">Uploading...</Text>
            </View>
          ) : selectedImage ? (
            <Image 
              source={{ uri: selectedImage }} 
              className="w-full h-full rounded-3xl"
              resizeMode="cover"
            />
          ) : (
            <AntDesign name="camera" size={80} color="#9CA3AF" />
          )}
        </TouchableOpacity>

        {/* Success Message */}
        {imgurUrl && (
          <View className="mb-8">
            <Text className="text-green-600 font-semibold text-center text-lg">
              ✅ Photo uploaded successfully!
            </Text>
          </View>
        )}

      </View>

      {/* Bottom Buttons */}
      <View className="pb-12">
        <View className="flex-row justify-between mx-4 mb-6">
          <TouchableOpacity
            onPress={handleNoThanks}
            className="bg-gray-400 px-8 py-4 rounded-full"
            style={{ minWidth: 120 }}
          >
            <Text className="text-white font-semibold text-lg text-center">No thanks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleContinue}
            className="bg-red-400 px-8 py-4 rounded-full"
            style={{ minWidth: 120 }}
          >
            <Text className="text-white font-semibold text-lg text-center">Continue</Text>
          </TouchableOpacity>
        </View>
        
        {/* Delete Button */}
        <View className="items-center">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/entries')}
            className="bg-red-600 p-3 rounded-full"
          >
            <AntDesign name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}