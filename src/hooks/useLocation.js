import { useEffect } from "react"
import * as Location from "expo-location"
import { useDriverMove } from '@/hooks/useApi'
import { isAndroid } from '@/lib/platform'
import { ToastAndroid } from 'react-native'

export function useForegroundLocation({ orderUid, orderLocationUid }) {
    const timeout = 1000 * 30 // 30s
    const driverMoveMutation = useDriverMove()
    
    useEffect(() => {
        let interval = null
        
        const fetchAndSend = async () => {
            console.log('fetch and send', orderUid, orderLocationUid)

            if (!orderUid || !orderLocationUid) return

            const coords = await getLocation()
            if (!coords) return

            const payload = {
                name: "탁송기사 이동 기록",
                type: "MOVE",
                latitude: coords.latitude,
                longitude: coords.longitude,
                orderUid: orderUid,
                orderLocationUid: orderLocationUid,
            }

            console.log("📍 포어그라운드 위치:", payload)

            await driverMoveMutation.mutateAsync(payload)

            if (isAndroid) {
                ToastAndroid.show("주문 진행 중 기사님의 이동 기록 저장 및 고객 안내를 위해 위치정보를 전송 합니다.", ToastAndroid.SHORT)
            }
        }
        
        // 1회 실행
        fetchAndSend()

        // 30초마다 실행
        interval = setInterval(fetchAndSend, timeout)
        
        return () => {
            clearInterval(interval)
        }
    }, [orderUid, orderLocationUid])
}

export async function getLocation() {
    try {
        const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
        })

        return loc.coords

    } catch (err) {
        console.log("포어그라운드 위치 가져오기 실패:", err)
        return null
    }
}