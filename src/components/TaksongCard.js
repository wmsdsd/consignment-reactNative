import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { secondToTimeHangul, addCommaToNumber, mToKm } from '@/lib/utils'
import {checkAllPermissionsAsync} from "@/lib/permissions"

const statusText = {
    "DRIVER_ASSIGN": "기사 배정",
    "DRIVER_RECEIVE": "배정 완료",
    "DRIVER_START": "출발지",
    "DRIVER_MIDDLE": "경유지",
    "DRIVER_END": "도착지",
    "DRIVER_ROUND": "복귀(왕복)",
    "DISPUTE": "분쟁중"
}

const statusColor = {
    "DRIVER_ASSIGN": "bg-assign",
    "DRIVER_RECEIVE": "bg-receive",
    "DRIVER_START": "bg-receive",
    "DRIVER_MIDDLE": "bg-receive",
    "DRIVER_END": "bg-receive",
    "DRIVER_ROUND": "bg-receive",
    "DISPUTE": "bg-dispute",
}

export default function TaksongCard({
    id,
    status,
    price= 0,
    carNumber = null,
    distance = 0,
    duration = 0,
    start = null,
    end = null,
    isRound = false
}) {
    const handlePress = async () => {
        /**
         *             "BOOKING_WAIT": "예약 대기",
         *             "BOOKING_COMPLETE": "예약 완료",
         *             "BOOKING_CANCEL": "예약 취소",
         *             "DRIVER_ASSIGN": "기사 배정",
         *             "DRIVER_RECEIVE": "배정 완료",
         *             "DRIVER_START": "출발지",
         *             "DRIVER_MIDDLE": "경유지",
         *             "DRIVER_END": "도착지",
         *             "DRIVER_ROUND": "복귀(왕복)",
         *             "DELIVERY_COMPLETE": "탁송 완료",
         *             "DISPUTE": "분쟁중"
         */

        switch (status) {
            case "DRIVER_ASSIGN":   // 기사 배정
                router.push(`/(protected)/taksongs/${id}`)
                break
            case "DRIVER_RECEIVE":  // 배정 완료
            case "DRIVER_START":    // 출발지
            case "DRIVER_MIDDLE":   // 경유지
            case "DRIVER_END":      // 도착지
            case "DRIVER_ROUND":    // 왕복지
                const permission = await checkAllPermissionsAsync()
                if (permission?.allGranted) {
                    router.push(`/(protected)/taksongs/${id}/confirm`)
                }
                else {
                    Alert.alert('권한이 필요합니다', '위치, 카메라, 사진 접근 권한을 모두 허용해주세요.')
                }
                break
            case "DISPUTE":         // 분쟁중
                break
        }
    }
    
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className="mb-4 w-full rounded-xl bg-[#1E1E1E] p-4"
        >
            {/* 상단 Row */}
            <View className="mb-2 flex-row items-center justify-between">
                <View className={"flex flex-row items-center"}>
                    <View className={`rounded-md px-3 py-1 ${statusColor[status] || 'bg-gray-600'}`}>
                        <Text className="text-xs font-semibold text-white">{statusText[status]}</Text>
                    </View>
                    {isRound && (
                        <Text className="text-xs font-semibold text-white ml-4">(왕복)</Text>
                    )}
                </View>
                
                <Text className="text-xl font-bold text-white">{addCommaToNumber(price)} 원</Text>
            </View>
            
            {/* 차량 번호 + 거리/시간 */}
            <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-white">
                    {carNumber ? `🚗 ${carNumber}` : '차량 배정 대기'}
                </Text>
                
                <Text className="text-sm text-gray-300">
                    {mToKm(distance)} | {secondToTimeHangul(duration)}
                </Text>
            </View>
            
            {/* 출발 */}
            <View className="mb-1 flex-row">
                <Text className="w-10 text-gray-400">출발</Text>
                <Text className="flex-1 text-white">{start}</Text>
            </View>
            
            {/* 도착 */}
            <View className="flex-row">
                <Text className="w-10 text-gray-400">도착</Text>
                <Text className="flex-1 text-white">{end}</Text>
            </View>
        </TouchableOpacity>
    );
}
