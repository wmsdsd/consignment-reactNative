// @/lib/backgroundLocation.js
import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { BACKGROUND_TASK_NAME } from './background-location-task';

export function useRealtimeLocation(enabled) {
    const enabledRef = useRef(enabled);

    useEffect(() => {
        enabledRef.current = enabled;
        // ❌ 여기서 startLocationUpdatesAsync 절대 호출하지 않음
        // 이 Hook은 "상태 연결용"으로만 존재
    }, [enabled]);
}

export async function startBackgroundLocation() {
    // 1. Foreground permission
    const fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== 'granted') {
        throw new Error('Foreground location permission denied');
    }

    // 2. Background permission (Android 12 필수)
    const bg = await Location.requestBackgroundPermissionsAsync();
    if (bg.status !== 'granted') {
        throw new Error('Background location permission denied');
    }

    // 3. 중복 실행 방지
    const hasStarted =
        await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);

    if (hasStarted) return;

    // 4. 시작
    await Location.startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000 * 60 * 2,
        distanceInterval: 100,
        foregroundService: {
            notificationTitle: '위치 서비스 실행 중',
            notificationBody: '배경에서도 위치를 수집합니다.',
        },
    });
}

export async function stopBackgroundLocation() {
    const isRunning =
        await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);

    if (isRunning) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
        console.log('🛑 백그라운드 위치 추적 중단됨');
    }
}
