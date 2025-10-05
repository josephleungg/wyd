import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

interface TranscriptMessage {
  role: 'user' | 'agent';
  message: string;
}

interface TranscriptResponse {
  transcript: TranscriptMessage[];
}

export default function TranscriptScreen() {
  const { id, title } = useLocalSearchParams();
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const entryId = id as string;
  const entryTitle = title as string;

  const fetchTranscript = async () => {
    try {
      setLoading(true);
      const apiUrl = `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8000/entries/transcript/${entryId}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transcript: ${response.status}`);
      }
      
      const data: TranscriptResponse = await response.json();
      setTranscript(data.transcript);
    } catch (err) {
      console.error('Error fetching transcript:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transcript');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscript();
  }, [entryId]);

  const renderMessage = (msg: TranscriptMessage, index: number) => {
    const isUser = msg.role === 'user';
    
    return (
      <View key={index} className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Role Label */}
        <Text className={`text-xs font-medium mb-1 ${isUser ? 'text-blue-600' : 'text-green-600'}`}>
          {isUser ? 'You' : 'AI Assistant'}
        </Text>
        
        {/* Message Bubble */}
        <View 
          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-blue-500 rounded-tr-sm' 
              : 'bg-gray-200 rounded-tl-sm'
          }`}
        >
          <Text className={`text-base leading-6 ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {msg.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-24 pb-12 px-6">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <AntDesign name="left" size={20} color="#B85C71" />
          <Text className="text-tertiary font-bold"> back to entry</Text>
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold text-secondary">Conversation Transcript</Text>
        <Text className="text-lg text-gray-600 mt-2">{entryTitle}</Text>
        
        {/* Entry ID Badge */}
        <View className="bg-primary px-4 py-2 rounded-full self-start mt-4">
          <Text className="text-secondary font-medium">Entry #{entryId}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#B85C71" />
            <Text className="text-gray-500 mt-4">Loading transcript...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <AntDesign name="exclamation-circle" size={48} color="#EF4444" />
            <Text className="text-red-500 text-center mt-4 text-lg">Failed to load transcript</Text>
            <Text className="text-gray-500 text-center mt-2">{error}</Text>
            <TouchableOpacity 
              onPress={fetchTranscript}
              className="bg-tertiary px-6 py-3 rounded-full mt-4"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {transcript.length > 0 ? (
              transcript.map((msg, index) => renderMessage(msg, index))
            ) : (
              <View className="flex-1 justify-center items-center py-20">
                <AntDesign name="message" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-4 text-lg">No transcript available</Text>
                <Text className="text-gray-400 text-center mt-2">This entry doesn't have a conversation transcript.</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}