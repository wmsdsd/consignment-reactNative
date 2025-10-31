// app/(protected)/(tabs)/home.js
import { View, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image source={require('@assets/logo.png')} className="h-48 w-48" resizeMode="contain" />
    </View>
  );
}
