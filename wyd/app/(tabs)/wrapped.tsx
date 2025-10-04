import { Image } from 'expo-image';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function WrappedScreen() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Image
          source={require('@/assets/images/wrapped_header.png')}
          style={{ width: '100%', height: 250 }}
          contentFit="cover"
        />

        <View className="flex-col bg-primary m-4 py-6 px-10 gap-2 rounded-3xl">
          <Text className="font-semibold text-[#9B4F61] text-lg">
            hello Dawg. your week so far is
          </Text>
          <Text className="font-extrabold text-[#132740] text-5xl mt-2">
            All Good
          </Text>

          {/* Line bars */}
          <View className="flex-row justify-between mt-6 gap-2">
            <View style={[styles.line, { backgroundColor: '#132740', width: 50 }]} />
            <View style={[styles.line, { backgroundColor: '#233F73', width: 50 }]} />
            <View style={[styles.line, { backgroundColor: '#3B6BA1', width: 50 }]} />
            <View style={[styles.line, { backgroundColor: '#7394BE', width: 50 }]} />
            <View style={[styles.line, { backgroundColor: '#B6C1D3', width: 80 }]} />
          </View>
        </View>

        <View className='flex flex-row items-center gap-6 m-8'>
          <View className='flex-1'>
            <Text className='text-4xl font-bold'>we chatted for a total of</Text>
          </View>
          <View className='flex-1 flex-col items-center'>
            <Text className='text-7xl font-black text-tertiary scale-y-stretch'>132</Text>
            <Text className='text-xl font-bold'>minutes this week</Text>
          </View>
        </View>

        <View className='flex flex-row items-center gap-6 m-8'>
          <View className='flex-1'>
            <Text className='text-7xl font-black text-tertiary scale-y-stretch'>1321</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-xl font-bold'><Text className='text-3xl font-bold'>words.</Text> that's longer than a short story</Text>
          </View>
        </View>

        <View className='flex flex-row items-center m-8 gap-8'>
          <View className='flex-1 flex-col items-center gap-12'>
            <Image
              source={require('@/assets/images/flower_icon.png')}
              style={{ width: 100, height: 100 }}
            />
            <Text className='text-xl font-normal'>this is a another quote the user has said in their calls said using <Text className='font-bold'>keyword</Text></Text>
            <Image
              source={require('@/assets/images/entries_icon.png')}
              style={{
                width: 100,
                height: 100,
                transform: [{ rotate: '-90deg' }] // <- this actually rotates it
              }}
            />
          </View>

          <View className="absolute inset-y-0 left-1/2 w-[2px] bg-tertiary" />

          <View className='flex-1 flex-col items-center gap-12'>
            <Text className='text-xl font-normal'>this is a quote the user said using <Text className='font-bold'>keyword</Text></Text>
            <Image
              source={require('@/assets/images/medal.png')}
              style={{ width: 100, height: 100 }}
            />
            <Text className='text-xl font-normal'>this <Text className='font-bold'>keyword</Text> has been used by the user in the calls and the ai picked up on it</Text>
          </View>
        </View>

        <View className='flex flex-col items-center justify-center m-16'>
          <Text className='text-7xl font-semibold text-tertiary'>"keyword"</Text>
          <Text className='text-xl font-bold'>was one thing you talked about a lot</Text>
        </View>

        <Image
          source={require('@/assets/images/mood_forecast.png')}
          style={{ width: '100%', height: 170 }}
          contentFit="cover"
        />

        <View className="flex-row my-12">
          <View className="bg-tertiary rounded-r-full justify-center py-32 px-12">
            <Text className="text-white font-bold text-5xl">Next{'\n'}Week:</Text>
          </View>
          <View className="flex-1 bg-white justify-center px-6 py-10 rounded-r-3xl">
            <Text className="text-2xl font-semibold">
              Since you felt so good after your walk in the park, maybe try another one this weekend?
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 5,
    borderRadius: 10,
  },
});
