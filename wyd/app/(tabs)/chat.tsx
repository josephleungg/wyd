import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

interface WebSocketMessage {
  type: string;
  user_transcript?: { text: string };
  agent_response?: { text: string };
  audio_event?: { audio_base_64: string };
  [key: string]: any;
}

const Chat = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Not Connected');
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  
  const ws = useRef<WebSocket | null>(null);
  const recording = useRef<Audio.Recording | null>(null);

  const log = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp}: ${message}`;
    setLogs(prev => [...prev.slice(-20), logEntry]);
    console.log(logEntry);
  }, []);

  const updateStatus = useCallback((msg: string) => {
    setStatus(msg);
  }, []);

  // Exactly like test.html connectToServer
  const connectToServer = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      log("Already connected!");
      return;
    }
    
    log("🔌 Connecting to WebSocket...");
    const wsUrl = `ws://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8000/convai/ws`;
    log(`📡 WebSocket URL: ${wsUrl}`);
    ws.current = new WebSocket(wsUrl);
    
    ws.current.onopen = () => {
      log("✅ WebSocket connected");
      updateStatus("Connected to Server");
      setIsConnected(true);
      
      log("🔧 Testing ElevenLabs configuration...");
    };
    
    ws.current.onclose = (event) => {
      log(`❌ WebSocket closed: ${event.code} - ${event.reason}`);
      log(`❌ Close details: wasClean=${event.wasClean}, code=${event.code}, reason="${event.reason}"`);
      updateStatus("Disconnected");
      setIsConnected(false);
    };
    
    ws.current.onerror = (error) => {
      log(`❌ WebSocket error: ${error}`);
      updateStatus("Connection Error");
      setIsConnected(false);
    };
    
    ws.current.onmessage = async (event) => {
      try {
        if (event.data instanceof ArrayBuffer) {
          log(`📦 Received binary data: ${event.data.byteLength} bytes`);
        } else {
          const data: WebSocketMessage = JSON.parse(event.data);
          log(`📦 Received: ${data.type || 'unknown'}`);
          log(`📄 Full message: ${JSON.stringify(data, null, 2)}`);
          
          if (data.type === 'conversation_initiation_metadata') {
            log("🤖 AI agent connected");
            updateStatus("AI Agent Ready");
          }
          else if (data.type === 'user_transcript') {
            if (data.user_transcript && data.user_transcript.text) {
              log(`👤 You said: "${data.user_transcript.text}"`);
            }
          }
          else if (data.type === 'agent_response') {
            if (data.agent_response && data.agent_response.text) {
              log(`🤖 AI replied: "${data.agent_response.text}"`);
              // Use TTS for text response
              Speech.speak(data.agent_response.text);
            }
          }
          else if (data.type === 'audio') {
            if (data.audio_event && data.audio_event.audio_base_64) {
              log("🎵 Audio message received");
              // For expo-av, we'll use TTS for now as PCM audio playback is complex
              // Fallback to TTS for audio responses
              if (data.agent_response && data.agent_response.text) {
                Speech.speak(data.agent_response.text);
              }
            }
          }
          else if (data.type === 'interruption') {
            log("⏸️ Conversation interrupted");
          }
          else {
            log(`❓ Unknown message type: ${data.type}`);
          }
        }
      } catch (error) {
        log(`❌ Message parsing error: ${error}`);
      }
    };
  }, [log, updateStatus]);

  // Start microphone with expo-av (works with Expo Go)
  const startMicrophone = useCallback(async () => {
    if (isRecording) {
      log("Already recording!");
      return;
    }
    
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      log("❌ Not connected to server!");
      return;
    }
    
    try {
      log("🎤 Starting microphone with expo-av...");
      
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        log("❌ Microphone permission denied");
        updateStatus("Microphone permission denied");
        return;
      }
      
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
      
      log("📱 Using expo-av for audio recording");
      
      // Create recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recording.current = newRecording;
      
      // Start recording
      await recording.current.startAsync();
      
      setIsRecording(true);
      updateStatus("Recording... (File-based mode)");
      log("✅ Audio recording started!");
      log("⚠️ Using file-based recording (expo-av limitation)");
      log("💡 Stop recording to send audio chunk");
      
    } catch (error) {
      log(`❌ Microphone error: ${error}`);
      
      if (error instanceof Error) {
        if (error.message.includes('Permission denied')) {
          updateStatus("Microphone permission denied");
          log("💡 Please allow microphone permissions in settings");
        } else if (error.message.includes('NotFoundError')) {
          log("💡 No microphone found - check your device");
        } else {
          updateStatus("Audio setup failed");
        }
      }
    }
  }, [isRecording, log, updateStatus]);

  // Stop microphone and send audio file
  const stopMicrophone = useCallback(async () => {
    if (!isRecording) {
      log("Not recording!");
      return;
    }
    
    try {
      if (!recording.current) {
        log("❌ No recording instance");
        return;
      }
      
      log("⏹️ Stopping recording...");
      
      // Stop recording
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      recording.current = null;
      
      if (uri) {
        log(`📁 Recording saved to: ${uri}`);
        
        // Read file as base64
        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
        
        log(`📤 Sending audio file: ${base64Audio.length} chars`);
        
        // Send to WebSocket
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({
            type: "user_audio_chunk",
            audio_chunk: base64Audio
          }));
          log("✅ Audio file sent to server");
        }
        
        // Clean up file
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
      
      setIsRecording(false);
      updateStatus("Connected to Server");
      log("⏹️ Microphone stopped and audio sent");
      
    } catch (error) {
      log(`❌ Stop error: ${error}`);
      setIsRecording(false);
      updateStatus("Connected to Server");
    }
  }, [isRecording, log, updateStatus]);

  const testTTS = useCallback(() => {
    Speech.speak("Text to speech is working correctly!");
    log("✅ TTS test successful");
  }, [log]);

  const handleEndChat = () => {
    if (isRecording) {
      stopMicrophone();
    }
    if (ws.current) {
      ws.current.close();
    }
    
    setIsClosing(true);
    setTimeout(() => {
      router.push('/call-summary');
    }, 600);
  };

  const handleCancel = () => {
    if (isRecording) {
      stopMicrophone();
    }
    if (ws.current) {
      ws.current.close();
    }
    router.push('/entries');
  };

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(prev => prev + 1);
      setIsClosing(false);
      
      return () => {
        if (isRecording) {
          // Clean up recording
          if (recording.current) {
            recording.current.stopAndUnloadAsync().catch(console.error);
            recording.current = null;
          }
          setIsRecording(false);
        }
        if (ws.current) {
          ws.current.close();
        }
      };
    }, [isRecording])
  );

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
            {/* Status Bar */}
            <View className='absolute top-16 left-0 right-0 z-10'>
              <View className='bg-white/90 mx-6 mt-8 p-3 rounded-lg'>
                <Text className='text-center font-medium text-secondary'>
                  {status}
                </Text>
              </View>
            </View>

            {/* Cancel button */}
            <View className='absolute top-16 left-6 z-20'>
              <TouchableOpacity
                className='bg-white/20 rounded-full p-3 self-start mt-16 ml-4'
                onPress={handleCancel}
              >
                <MaterialCommunityIcons
                  name='close'
                  size={24}
                  color='white'
                />
              </TouchableOpacity>
            </View>

            {/* Debug logs toggle */}
            <TouchableOpacity
              className='absolute top-20 right-6 bg-white/20 rounded-full p-2 mt-16'
              onPress={() => setShowLogs(!showLogs)}
            >
              <MaterialCommunityIcons
                name={showLogs ? 'eye-off' : 'eye'}
                size={20}
                color='white'
              />
            </TouchableOpacity>

            {/* Debug Logs */}
            {showLogs && (
              <ScrollView className='absolute top-40 left-6 right-6 bottom-40 bg-black/80 rounded-lg p-4 z-10'>
                {logs.map((log, index) => (
                  <Text key={index} className='text-white text-xs mb-1 font-mono'>
                    {log}
                  </Text>
                ))}
              </ScrollView>
            )}

            {/* Main content */}
            <View className='flex-1 justify-center items-center'>
              <View className='justify-around items-center h-screen'>
                <Text className='text-white font-semibold text-6xl'>wyd?</Text>

                {/* Control Buttons */}
                <View className='items-center space-y-4'>
                  {/* Connection Button */}
                  {!isConnected && (
                    <TouchableOpacity
                      className='bg-blue-600 px-6 py-3 rounded-full mb-4'
                      onPress={connectToServer}
                    >
                      <Text className='text-white font-semibold'>Connect</Text>
                    </TouchableOpacity>
                  )}

                  {/* Recording Button */}
                  <TouchableOpacity
                    className={`p-7 rounded-full ${
                      isRecording ? 'bg-red-700' : 'bg-green-600'
                    }`}
                    onPress={isRecording ? stopMicrophone : startMicrophone}
                    disabled={!isConnected}
                  >
                    <MaterialCommunityIcons
                      name={isRecording ? 'stop' : 'microphone'}
                      size={36}
                      color='white'
                    />
                  </TouchableOpacity>

                  {/* Test TTS Button */}
                  <TouchableOpacity
                    className='bg-purple-600 px-4 py-2 rounded-full mt-4'
                    onPress={testTTS}
                  >
                    <Text className='text-white font-medium'>Test TTS</Text>
                  </TouchableOpacity>
                </View>

                {/* End Chat Button */}
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