import { View, Text, Pressable, Alert, ScrollView, Image } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { checkAllPermissionsAsync } from '@/lib/utils'
import {useOrder, useOrderCancel, useOrderStatusUpdate} from '@/hooks/useApi'
import { mToKm, addCommaToNumber, secondToTimeHangul, getAddressShort } from '@/lib/utils'

export default function TaksongDetailScreen() {
    const { id } = useLocalSearchParams()
    const { data } = useOrder(id)
    const insets = useSafeAreaInsets()

    const orderCancelMutation = useOrderCancel()
    const orderStatusUpdateMutation = useOrderStatusUpdate()
    
    // 배정 취소 핸들러
    const handleCancel = () => {
        Alert.alert('배정 취소', '정말 배정을 취소하시겠습니까?', [
            {
                text: '취소',
                style: 'cancel'
            },
            {
                text: '확인',
                style: 'destructive',
                onPress: async () => {
                    const res = await orderCancelMutation.mutateAsync(id)
                    if (res) {
                        Alert.alert('완료', '배정이 취소되었습니다.');
                        router.back()
                    }
                },
            },
        ]);
    };
    
    // 탁송 시작 핸들러 - 예약 확인 페이지로 이동
    
    const handleStart = async () => {
        const result = await checkAllPermissionsAsync();

        if (result?.allGranted) {
            // ✅ 모든 권한 허용 → 다음 화면으로 이동
            const res = await orderStatusUpdateMutation.mutateAsync({
                orderId: id,
                status: "DRIVER_RECEIVE"
            })

            if (res) {
                router.push(`/(protected)/taksongs/${id}/confirm`);
            }
        } else {
            // ❌ 하나라도 거부됨 → 경고 표시
            Alert.alert('권한이 필요합니다', '위치, 카메라, 사진 접근 권한을 모두 허용해주세요.');
        }
    }
    
    if (!data) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-lg text-gray-300">탁송 정보를 찾을 수 없습니다.</Text>
                <Pressable
                    onPress={() => router.back()}
                    className="mt-4 rounded-lg bg-purple-700 px-6 py-3"
                >
                    <Text className="font-semibold text-white">목록으로 돌아가기</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <View className="flex-1 p-4">
                <View className="flex-1">
                    {/* 카드 */}
                    <View className="w-full flex-1 items-center justify-center rounded-2xl bg-neutral-900 p-6">
                        {/* 차량 번호 */}
                        <Text className="text-center text-4xl font-bold text-white">
                            {data.carNumber || '미배정'}
                        </Text>
                        
                        {/* 거리 및 시간 */}
                        <View className="mt-5 flex-row justify-center gap-4">
                            <Text className="text-xl text-gray-300">{mToKm(data.distance)}</Text>
                            <Text className="text-lg text-gray-600">|</Text>
                            <Text className="text-xl text-gray-300">{secondToTimeHangul(data.time)}</Text>
                            { data.isRound && (
                                <>
                                    <Text className="text-lg text-gray-600">|</Text>
                                    <Text className="text-xl text-gray-300">왕복</Text>
                                </>
                            )}
                        </View>
                        
                        {/* 위치 정보 */}
                        <ScrollView>
                            {data?.orderLocations && data.orderLocations.map((location, index) => (
                                <View key={'order-location-' + location.uid}>
                                    <View className="mt-7 items-center">
                                        <Text className="mb-2 rounded-md bg-green-600 px-3 py-1.5 text-sm text-white">
                                            {location.typeName}
                                        </Text>
                                        <Text className="text-3xl font-bold text-white text-center">
                                            {getAddressShort(location)}
                                        </Text>
                                    </View>

                                    {/* 화살표 */}
                                    { index !== data.orderLocations.length - 1 && (
                                        <View className="my-7 items-center">
                                            <Image
                                                source={require('../../../../assets/arrow.png')}
                                                className="h-20 w-20"
                                                resizeMode="contain"
                                            />
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    
                    {/* 하단 요금 */}
                    <View
                        className="mt-4 w-full flex-row items-center justify-between rounded-xl border border-color bg-black p-4">
                        <Text className="text-lg text-gray-300">탁송비</Text>
                        <Text className="text-2xl font-semibold text-white">{addCommaToNumber(data.deliveryPrice)} 원</Text>
                    </View>
                </View>
            </View>
            
            {/* Footer - 버튼들 */}
            <View
                className="border-t border-gray-800 bg-black px-4 py-4"
                style={{ paddingBottom: Math.max(insets.bottom, 60) }}
            >
                <View className="w-full flex-row gap-3">
                    <Pressable onPress={handleCancel} className="w-1/4 rounded-xl bg-neutral-800 py-4">
                        <Text className="text-center text-lg text-white">취소</Text>
                    </Pressable>
                    
                    <Pressable onPress={handleStart} className="flex-1 rounded-xl bg-btn py-4">
                        <Text className="text-center text-lg font-semibold text-white">탁송 시작</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
