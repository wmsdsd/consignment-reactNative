// app/(protected)/home.js
import { View, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Image source={require('@assets/logo.png')} className="h-48 w-48" resizeMode="contain" />
    </View>
  );
}
