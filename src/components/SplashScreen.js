import { View, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-[#2B00A6]"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* 로고 (가운데) */}
      <Image source={require('@assets/logo.png')} className="h-40 w-40" resizeMode="contain" />

      {/* 아래 텍스트 */}
      <View className="absolute bottom-10 w-full items-center">
        <Image
          source={require('@assets/logo_title.png')}
          className="h-40 w-40"
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
