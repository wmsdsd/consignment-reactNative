import { View, Text, TouchableOpacity } from 'react-native'
import { addCommaToNumber, mToKm, dateFormatter } from '@/lib/utils';

import "../../global.css"

const statusText = {
    "DRIVER_ASSIGN": "기사 배정",
    "DRIVER_RECEIVE": "배정 완료",
    "DRIVER_START": "출발지",
    "DRIVER_MIDDLE": "경유지",
    "DRIVER_END": "도착지",
    "DRIVER_ROUND": "복귀(왕복)",
    "DISPUTE": "분쟁중",
    "DELIVERY_COMPLETE": "탁송 완료",
}

const statusColor = {
    "DRIVER_ASSIGN": "bg-assign",
    "DRIVER_RECEIVE": "bg-receive",
    "DRIVER_START": "bg-receive",
    "DRIVER_MIDDLE": "bg-receive",
    "DRIVER_END": "bg-receive",
    "DRIVER_ROUND": "bg-receive",
    "DISPUTE": "bg-dispute",
    "DELIVERY_COMPLETE": "bg-primary",
}

const cardColor = {
    DRIVER_ASSIGN: "bg-card-assign",
    DRIVER_RECEIVE: "bg-card-receive",
    DRIVER_START: "bg-card-receive",
    DRIVER_MIDDLE: "bg-card-receive",
    DRIVER_END: "bg-card-receive",
    DRIVER_ROUND: "bg-card-receive",
    DISPUTE: "bg-card-dispute",
    DELIVERY_COMPLETE: "bg-card-primary",
}

export default function TaksongCard({
    id,
    status,
    handler,
    price= 0,
    carNumber = null,
    distance = 0,
    duration = 0,
    start = null,
    end = null,
    isRound = false,
    carBrand = null,
    carModel = null,
    expectedAt
}) {
    const handlePress = async () => {
        if (handler) {
            handler(id, status)
        }
    }

    let carInfo = "(없음)"
    if (carBrand) {
        carInfo = `(${carBrand})`
        if (carModel) {
            carInfo = `(${carBrand} ${carModel})`
        }
    }
    else if (carModel) {
        carInfo = `(${carModel})`
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`mb-4 w-full rounded-xl p-4 ${cardColor[status] || 'bg-[#1E1E1E]'}`}
        >
            {/* 상단 Row */}
            <View className="mb-2 flex-row items-center justify-between border-b border-1 border-[#ffffff33] pb-4">
                <View className={"flex flex-row items-center"}>
                    <View className={`rounded-md px-3 py-1 ${statusColor[status] || 'bg-gray-600'}`}>
                        <Text className="text-sm font-semibold text-white">{statusText[status]}</Text>
                    </View>
                    {isRound && (<Text className="text-sm font-semibold text-white ml-4">(왕복)</Text>)}
                </View>
                <Text className={"text-xl font-bold font-color-price"}>{addCommaToNumber(price)} 원</Text>
            </View>
            
            {/* 차량 번호 + 거리/시간 */}
            <View className="mb-2 flex-col">
                <Text className="text-xl font-bold text-white">
                    {carNumber ? `${carNumber}` : '차량 배정 대기'}
                    {" "}
                    {carInfo}
                </Text>
                <Text className="text-base text-[#ccc]">
                    {mToKm(distance)} | {dateFormatter(expectedAt, "YYYY-MM-DD HH:mm")}
                </Text>
            </View>
            
            {/* 출발 */}
            <View className="mb-1 flex-row">
                <Text className="w-10 text-lg text-[#ccc]">출발</Text>
                <Text className="flex-1 text-lg font-semibold text-white">{start}</Text>
            </View>
            
            {/* 도착 */}
            <View className="flex-row">
                <Text className="w-10 text-lg text-[#ccc]">도착</Text>
                <Text className="flex-1 text-lg font-bold text-white">{end}</Text>
            </View>
        </TouchableOpacity>
    )
}
