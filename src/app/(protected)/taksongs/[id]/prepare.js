import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrder } from '@/hooks/useApi';

export default function PrepareScreen() {
    const { id } = useLocalSearchParams()
    const { data: order } = useOrder(id)
    
    // 촬영시작 핸들러 - 촬영 안내 페이지로 이동
    const handleCameraStart = () => {
        router.push({
            pathname: `/(protected)/taksongs/${id}/camera`
        })
    }
    
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
        )
    }

    return (
        <View className="flex-1 bg-black">
            <ScrollView className="flex-1">
                {/* 차량 도착 헤더 */}
                <View className="mx-4 mt-6 rounded-xl border border-color bg-[#2C2C31] p-6 shadow-sm">
                    <View className="mb-2 items-center">
                        <Text className="text-2xl font-bold text-white">🚚 {order?.statusName} 도착</Text>
                        <Text className="mt-2 text-center text-sm text-white">
                            차량 장소에 도착했습니다. 사진 촬영을 진행해주세요.
                        </Text>
                    </View>
                </View>

                <View className="mx-4 my-6 rounded-xl border border-color bg-default p-6 shadow-sm">
                    <Text className="mb-4 text-lg font-bold text-white">촬영 가이드</Text>

                    {/* 가이드 항목들 */}
                    <View className="space-y-4">
                        {/* 항목 1 */}
                        <View className="flex-row items-start mb-4">
                            <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <Text className="text-base font-bold text-blue-700">1</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="mb-1 text-base font-semibold text-white">차량 번호판 확인</Text>
                                <Text className="text-sm leading-5 text-white">
                                    차량 번호판이 명확하게 보이도록 촬영해주세요. {"\n"}
                                    번호판 전체가 프레임에 들어와야 합니다.
                                </Text>
                            </View>
                        </View>

                        {/* 항목 2 */}
                        <View className="flex-row items-start mb-4">
                            <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <Text className="text-base font-bold text-blue-700">2</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="mb-1 text-base font-semibold text-white">차량 전체 촬영</Text>
                                <Text className="text-sm leading-5 text-white">
                                    차량 전체가 프레임에 들어오도록 촬영해주세요. {'\n'}
                                    앞면, 뒷면을 각각 촬영하는 것을 권장합니다.
                                </Text>
                            </View>
                        </View>

                        {/* 항목 3 */}
                        <View className="flex-row items-start mb-4">
                            <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <Text className="text-base font-bold text-blue-700">3</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="mb-1 text-base font-semibold text-white">주변 환경 확인</Text>
                                <Text className="text-sm leading-5 text-white">
                                    촬영 전 주변 환경을 확인해주세요. {'\n'}
                                    충분한 조명이 있는지 확인하고, 다른 차량이나 장애물이 없는지 확인해주세요.
                                </Text>
                            </View>
                        </View>

                        {/* 항목 4 */}
                        <View className="flex-row items-start">
                            <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <Text className="text-base font-bold text-blue-700">4</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="mb-1 text-base font-semibold text-white">사진 품질 확인</Text>
                                <Text className="text-sm leading-5 text-white">
                                    촬영 후 사진이 선명하게 나왔는지 확인해주세요. {'\n'}
                                    번호판이 흐리거나 잘 보이지 않으면 다시 촬영해주세요.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 안내 메시지 */}
                <View className="mx-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <Text className="mb-2 text-sm font-semibold text-yellow-800">📸 사진 촬영 안내</Text>
                    <Text className="text-sm text-yellow-800">
                        • 차량 번호판이 명확하게 보이도록 촬영해주세요{'\n'}
                        • 차량 전체가 프레임에 들어오도록 해주세요{'\n'}
                        • 촬영 전 주변 환경을 확인해주세요
                    </Text>
                </View>

                {/* 주의사항 */}
                <View className="mx-4 my-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <Text className="mb-2 text-sm font-semibold text-yellow-800">⚠️ 주의사항</Text>
                    <Text className="text-sm text-yellow-800">
                        • 촬영 시 카메라가 흔들리지 않도록 주의해주세요{'\n'}• 번호판이 반사되어 보이지 않으면
                        각도를 조절해주세요{'\n'}• 여러 각도에서 촬영하는 것을 권장합니다
                    </Text>
                </View>

                {/* 예시 이미지 영역 (플레이스홀더) */}
                <View className="mx-4 mb-6 rounded-lg border border-gray-200 bg-gray-100 p-6">
                    <Text className="mb-2 text-center text-sm font-medium text-gray-600">📷 촬영 예시</Text>
                    <View className="h-48 items-center justify-center rounded-lg bg-gray-200">
                        <Text className="text-gray-500">차량 사진 예시</Text>
                    </View>
                </View>

            </ScrollView>
            
            {/* 하단 버튼 영역 */}
            <View className="border-t border-gray-200 bg-black px-4 py-4 pb-20">
                <TouchableOpacity onPress={handleCameraStart} className="rounded-lg bg-blue-500 p-4">
                    <Text className="text-center text-xl font-semibold text-white">번호판 촬영</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
