import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { BACKGROUND_TASK_NAME } from './background-location-task';
import * as SecureStore from 'expo-secure-store';

export function useRealtimeLocation(enabled) {
    const enabledRef = useRef(enabled)

    useEffect(() => {
        enabledRef.current = enabled

        // ❌ 여기서 startLocationUpdatesAsync 절대 호출하지 않음
        // 이 Hook은 "상태 연결용"으로만 존재
    }, [enabled])
}

export async function requestLocationPermissions() {
    // 1. Foreground permission
    const fg = await Location.requestForegroundPermissionsAsync()
    if (fg.status !== 'granted') return false

    // 2. Background permission (Android 12 필수)
    const bg = await Location.requestBackgroundPermissionsAsync()
    return bg.status === 'granted'
}

export async function startBackgroundLocation() {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)

    if (hasStarted) return

    // 4. 시작
    await Location.startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000 * 60 * 2,                // 2분에 1번씩
        distanceInterval: 100,                      // 100m 이동 시
        showsBackgroundLocationIndicator: true,     // iOS
        pausesUpdatesAutomatically: false,
        foregroundService: {
            notificationTitle: '위치 서비스 실행 중',
            notificationBody: '백그라운드에서 위치를 수집합니다.',
        },
    });
}

export async function stopBackgroundLocation() {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)
    if (isRunning) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_TASK_NAME)
        await SecureStore.deleteItemAsync('bg_location_notified')
        console.log('🛑 백그라운드 위치 추적 중단됨')
    }
}
