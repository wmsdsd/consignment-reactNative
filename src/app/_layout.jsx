import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from '../components/SplashScreen';
import { AuthProvider } from '@/hooks/useAuth';
import { startBackgroundLocation } from '@/lib/backgroundLocation'
import { AppProvider } from '@/app/context/AppContext'

import '../../global.css'

// 스플래시 스크린이 자동으로 숨겨지지 않도록 설정
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [isSplashHidden, setIsSplashHidden] = useState(false);
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5분
                        retry: 1,
                    },
                },
            }),
    );
    
    useEffect(() => {
        // 기본 스플래시 스크린을 즉시 숨기고 커스텀 스플래시 스크린 표시
        async function hideNativeSplash() {
            try {
                // 최대한 빠르게 기본 스플래시 숨기기
                await SplashScreen.hideAsync()
            } catch (e) {
                console.warn('네이티브 스플래시 스크린 숨기기 오류:', e)
            } finally {
                setIsSplashHidden(true)
            }
        }


        (async () => {
            // 즉시 실행 (다음 틱에서)
            await hideNativeSplash()

            // 앱 실행 시 자동으로 백그라운드 위치 시작
            // await startBackgroundLocation()
        })()
    }, [])
    
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
        
        if (isSplashHidden) {
            prepare();
        }
    }, [isSplashHidden]);
    
    // 기본 스플래시가 숨겨지기 전이나 앱이 준비되지 않았을 때는 커스텀 스플래시 스크린 표시
    if (!isSplashHidden || !appIsReady) {
        return <CustomSplashScreen />;
    }
    
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppProvider>
                    <View className="bg-primary flex-1">
                        <Slot />
                    </View>
                </AppProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
