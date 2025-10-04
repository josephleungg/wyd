import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

const PLACEHOLDER_TRANSCRIPT = `[Recording started at 3:42 PM]

Speaker: Um, so today was really interesting. I woke up feeling pretty energized, which is always a good sign. The weather was perfect - you know, one of those crisp autumn mornings where the air just feels fresh and clean.

[Pause - 2 seconds]

Speaker: I think what really made the day special was this conversation I had with Sarah at the coffee shop. She was telling me about her new project at work, and it got me thinking about my own goals and aspirations. Sometimes you need those external perspectives to help you see your own situation more clearly.

[Background noise - coffee shop ambiance]

Speaker: The thing is, I've been so focused on the day-to-day routine that I haven't really stepped back to look at the bigger picture. Like, where am I heading? What do I really want to accomplish this year? These are the questions that keep coming up for me lately.

[Pause - 3 seconds]

Speaker: I guess what I'm realizing is that growth happens in those uncomfortable moments when you're forced to examine your assumptions. Today felt like one of those moments - not uncomfortable in a bad way, but in that productive way where you know something important is shifting.

[Recording paused at 3:47 PM]

[Recording resumed at 7:23 PM]

Speaker: Okay, so I'm back. Had dinner and wanted to add some thoughts about this afternoon. The conversation with Sarah really stuck with me. She mentioned this book about intentional living, and I think I want to check it out.

[Sound of pages turning]

Speaker: I've been carrying around this notebook all day, just jotting down random thoughts. It's funny how when you start paying attention to your inner dialogue, you realize how much is actually going on up there. Most of it's just noise, but some of it... some of it feels important.

[Pause - 5 seconds]

Speaker: Tomorrow I want to try something different. Maybe wake up a little earlier, go for a walk before checking my phone. Create some space for reflection before the day gets away from me. Small changes, but they might add up to something meaningful.

[Recording ended at 7:29 PM]

---

Total recording time: 11 minutes, 47 seconds
Word count: 387 words
Sentiment analysis: Positive (82% confidence)
Key themes: Personal growth, reflection, intentional living, mindfulness

Auto-generated summary: The speaker reflects on a day of personal insight triggered by a meaningful conversation. They express a desire for more intentional living and plan to implement small changes to create space for reflection.`;

export default function TranscriptScreen() {
  const { id, title } = useLocalSearchParams();

  const entryId = id as string;
  const entryTitle = title as string;

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
        
        <Text className="text-2xl font-bold text-secondary">Full Transcript</Text>
        <Text className="text-lg text-gray-600 mt-2">{entryTitle}</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Entry ID Badge */}
        <View className="bg-primary px-4 py-2 rounded-full self-start mb-6">
          <Text className="text-secondary font-medium">Entry #{entryId}</Text>
        </View>

        {/* Placeholder Transcript Content */}
        <View className="border-l-8 border-secondary pl-6">
          <Text className="text-gray-700 leading-7 text-base">
            {PLACEHOLDER_TRANSCRIPT}
          </Text>
        </View>
        
      </ScrollView>
    </View>
  );
}