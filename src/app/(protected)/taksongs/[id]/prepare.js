import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrder } from '@/hooks/useApi';

// 상태 타입 정의
const STATUS = {
    DRIVER_START: '출발지',
    DRIVER_MIDDLE: '경유지',
    DRIVER_END: '도착지',
    DRIVER_ROUND: '왕복지',
}

// 상태별 색상
const getStatusColor = status => {
    switch (status) {
        case STATUS.DRIVER_START:
            return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
        case STATUS.DRIVER_MIDDLE:
            return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
        case STATUS.DRIVER_END:
            return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
        case STATUS.DRIVER_ROUND:
            return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
};

export default function PrepareScreen() {
    const { id } = useLocalSearchParams()
    const { data: order } = useOrder(id)
    
    // 촬영시작 핸들러 - 촬영 안내 페이지로 이동
    const handleCameraStart = () => {
        router.push(`/(protected)/taksongs/${id}/prepare/camera-guide`);
    };
    
    if (!order) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <Text className="text-lg text-gray-600">탁송 정보를 찾을 수 없습니다.</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-4 rounded-lg bg-blue-500 px-6 py-3"
                >
                    <Text className="font-semibold text-white">목록으로 돌아가기</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    const statusColors = getStatusColor(order.status)
    
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                {/* 차량 도착 헤더 */}
                <View className="mx-4 mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                    <View className="mb-2 items-center">
                        <Text className="text-2xl font-bold text-blue-700">🚚 차량 도착</Text>
                        <Text className="mt-2 text-center text-sm text-gray-600">
                            차량 장소에 도착했습니다. 사진 촬영을 진행해주세요.
                        </Text>
                    </View>
                </View>
                
                {/* 탁송 정보 */}
                <View className="mx-4 my-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    {/* 상태 배지 */}
                    <View className="mb-6 flex-row items-center justify-between">
                        <View
                            className={`rounded-full border px-4 py-2 ${statusColors.bg} ${statusColors.border}`}
                        >
                            <Text className={`text-sm font-semibold ${statusColors.text}`}>{order?.statusName}</Text>
                        </View>
                        {order?.carNumber && (
                            <View className="rounded-full bg-gray-100 px-4 py-2">
                                <Text className="text-sm font-medium text-gray-700">
                                    🚗 {order.carNumber}
                                </Text>
                            </View>
                        )}
                    </View>
                    
                    {/* 출발지 */}
                    <View className="mb-4 flex-row items-start">
                        <View className="mr-4 mt-2 h-3 w-3 rounded-full bg-green-500" />
                        <View className="flex-1">
                            <Text className="mb-2 text-sm font-medium text-gray-500">출발지</Text>
                            <Text className="text-base font-semibold leading-6 text-gray-900">
                                --- 여기는 출발지 주소 ---
                            </Text>
                        </View>
                    </View>
                    
                    {/* 도착지 */}
                    <View className="mb-6 flex-row items-start">
                        <View className="mr-4 mt-2 h-3 w-3 rounded-full bg-red-500" />
                        <View className="flex-1">
                            <Text className="mb-2 text-sm font-medium text-gray-500">도착지</Text>
                            <Text className="text-base font-semibold leading-6 text-gray-900">
                                --- 여기는 도착지 주소 ---
                            </Text>
                        </View>
                    </View>
                    
                    {/* 구분선 */}
                    <View className="mb-6 border-t border-gray-200 pt-6">
                        <View className="space-y-4">
                            {/* 거리 */}
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm text-gray-500">거리</Text>
                                <Text className="text-lg font-semibold text-gray-900">{order?.distance}</Text>
                            </View>
                            
                            {/* 소요시간 */}
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm text-gray-500">예상 소요시간</Text>
                                <Text className="text-lg font-semibold text-gray-900">{order?.time}</Text>
                            </View>
                            
                            {/* 요금 */}
                            <View className="flex-row items-center justify-between border-t border-gray-200 pt-4">
                                <Text className="text-base font-medium text-gray-700">요금</Text>
                                <Text className="text-2xl font-bold text-red-600">{order?.deiveryPrice}</Text>
                            </View>
                        </View>
                    </View>
                    
                    {/* 추가 정보 영역 */}
                    <View className="rounded-lg bg-gray-50 p-4">
                        <Text className="mb-2 text-xs font-medium text-gray-500">예약 번호</Text>
                        <Text className="text-sm font-semibold text-gray-900">#{order?.uid}</Text>
                    </View>
                </View>
                
                {/* 안내 메시지 */}
                <View className="mx-4 mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <Text className="mb-2 text-sm font-semibold text-yellow-800">📸 사진 촬영 안내</Text>
                    <Text className="text-sm text-yellow-800">
                        • 차량 번호판이 명확하게 보이도록 촬영해주세요{'\n'}• 차량 전체가 프레임에 들어오도록
                        해주세요{'\n'}• 촬영 전 주변 환경을 확인해주세요
                    </Text>
                </View>
            </ScrollView>
            
            {/* 하단 버튼 영역 */}
            <View className="border-t border-gray-200 bg-white px-4 py-4 pb-12">
                <TouchableOpacity onPress={handleCameraStart} className="rounded-lg bg-blue-500 p-4">
                    <Text className="text-center text-xl font-semibold text-white">촬영시작</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
