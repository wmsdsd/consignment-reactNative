import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때 스플래시 화면 표시
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 인증 상태에 따른 라우팅
  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
