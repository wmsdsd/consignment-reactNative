import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from '../components/SplashScreen';
import '../../global.css';

// 스플래시 스크린이 자동으로 숨겨지지 않도록 설정
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    async function prepare() {
      try {
        // 여기에 폰트 로딩이나 다른 초기화 작업을 추가할 수 있습니다
        // 예: await Font.loadAsync(...)

        // 최소 스플래시 스크린 표시 시간 (예: 2초)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('스플래시 스크린 준비 중 오류:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // 앱이 준비되면 스플래시 스크린 숨김
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // 앱이 준비되지 않았을 때는 커스텀 스플래시 스크린 표시
  if (!appIsReady) {
    return <CustomSplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View className="bg-primary flex-1" onLayout={onLayoutRootView}>
        <Slot />
      </View>
    </QueryClientProvider>
  );
}
