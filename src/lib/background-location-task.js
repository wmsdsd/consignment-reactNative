import * as TaskManager from "expo-task-manager"
import { AppState } from 'react-native'
import { driverMoveApi } from '@/lib/api'
import * as Notifications from 'expo-notifications'
import * as SecureStore from 'expo-secure-store'

const TASK_NAME = "BACKGROUND_LOCATION_TASK"

let isRunning = false

async function sendBackgroundLocationNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '위치정보 수집 안내',
            body: '앱이 백그라운드에서 위치 정보를 수집하여 서버로 전송합니다.',
        },
        trigger: null
    })
}

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.log("Location task error", error)
        return
    }
    if (isRunning) return
    if (AppState.currentState === 'active') return

    if (data) {
        const { locations } = data

        // 가장 최근 위치
        if (!locations || locations.length === 0) return
        const loc = locations[0]
        
        const payload = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: loc.timestamp,
        }

        isRunning = true
        console.log("📡 백그라운드 위치:", payload)

        // 서버 전송
        try {
            await driverMoveApi.background(payload)

            const notified = await SecureStore.getItemAsync('bg_location_notified')
            if (!notified) {
                await sendBackgroundLocationNotification()
                await SecureStore.setItemAsync('bg_location_notified', 'true')
            }

            return 2
        } catch (e) {
            console.warn("백그라운드 위치 전송 실패:", e)
            return 3
        }
        finally {
            isRunning = false
        }
    }
})

export const BACKGROUND_TASK_NAME = TASK_NAME
