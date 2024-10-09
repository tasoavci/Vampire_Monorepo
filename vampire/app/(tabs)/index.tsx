import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "react-native";
export default function TabOneScreen() {
  return (
    <View className="flex items-center justify-center h-full">
      <Text className="text-red-500 text-2xl">Selam</Text>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
