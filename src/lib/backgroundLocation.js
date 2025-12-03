import * as Location from "expo-location"
import { BACKGROUND_TASK_NAME } from "./background-location-task"

export async function startBackgroundLocation() {
    const { status } = await Location.requestBackgroundPermissionsAsync()
    if (status !== "granted") {
        console.log("❌ 백그라운드 권한 미허용")
        return
    }
    
    const timeInterval = 1000 * 60 * 2  // 2분 (백그라운드 권장)
    const distanceInterval = 100        // 100m 이동 시에도 갱신
    
    const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)
    if (!isRunning) {
        await Location.startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval: timeInterval,
            distanceInterval: distanceInterval,
            showsBackgroundLocationIndicator: true, // iOS
            foregroundService: {
                notificationTitle: "위치 서비스 실행 중",
                notificationBody: "배경에서도 위치를 수집합니다.",
            },
        })
        
        console.log("🚀 백그라운드 위치 추적 시작")
    }
}

export async function stopBackgroundLocation() {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)
    if (isRunning) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_TASK_NAME)
        console.log("🛑 백그라운드 위치 추적 중단됨")
    }
    else {
        console.log("백그라운드 위치 추적이 이미 꺼져 있음")
    }
}