import * as TaskManager from "expo-task-manager"
import { driverMoveApi } from '@/lib/api'

const TASK_NAME = "BACKGROUND_LOCATION_TASK"

let isRunning = false

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.log("Location task error", error)
        return
    }

    if (isRunning) return
    
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
        } catch (e) {
            console.warn("백그라운드 위치 전송 실패:", e)
        }
        finally {
            isRunning = false
        }
    }
})

export const BACKGROUND_TASK_NAME = TASK_NAME
