import { useEffect } from "react"
import * as Location from "expo-location"
import { useDriverMove } from '@/hooks/useApi'

export function useForegroundLocation({ orderUid, orderLocationUid }) {
    const timeout = 1000 * 30 // 30s
    const driverMoveMutation = useDriverMove()
    
    useEffect(() => {
        let interval = null
        
        const fetchAndSend = async () => {
            try {
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.BestForNavigation,
                })
                
                const payload = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    orderUid: orderUid,
                    orderLocationUid: orderLocationUid,
                }
                
                console.log("📍 포어그라운드 위치:", payload)
                
                await driverMoveMutation.mutateAsync(payload)
            } catch (err) {
                console.log("포어그라운드 위치 가져오기 실패:", err);
            }
        };
        
        // 1회 실행
        (async () => {
            await fetchAndSend()
        })()
        
        // 30초마다 실행
        interval = setInterval(fetchAndSend, timeout)
        
        return () => {
            clearInterval(interval)
        }
    }, [])
}
