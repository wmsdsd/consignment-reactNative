import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useOrder } from '@/hooks/useApi';
import { addCommaToNumber, formatDate, formatPhone, formatTime, mToKm, secondToTimeHangul } from '@/lib/utils';
import { Fragment } from 'react';


export default function HistoryDetailsScreen() {
    const { id } = useLocalSearchParams()
    const { data: order, isLoading } = useOrder(id)

    return (
        isLoading
            ? (<ActivityIndicator size="large" color="#0000ff" />)
            : (
                <View className={"flex-1 bg-black"}>
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="w-full">
                            <View className="mt-6 p-4">
                                <Text className="mb-3 text-lg font-semibold font-color-sub">기본 정보</Text>

                                <View className="mb-3 flex-row">
                                    <Text className="w-28 text-gray-300">차량번호</Text>
                                    <Text className="font-semibold text-white">
                                        {order.carNumber} {`(${order.carBrandName}/${order.carModel})`}
                                    </Text>
                                </View>

                                <View className="mb-3 flex-row">
                                    <Text className="w-28 text-gray-300">배차 유형</Text>
                                    <Text className="font-semibold text-white">{order.deliveryTypeName}</Text>
                                </View>

                                <View className="mb-3 flex-row">
                                    <Text className="w-28 text-gray-300">총 거리</Text>
                                    <Text className="font-semibold text-white">{mToKm(order.distance)}</Text>
                                </View>

                                <View className="mb-3 flex-row">
                                    <Text className="w-28 text-gray-300">탁송 금액</Text>
                                    <Text className="font-semibold text-white">{addCommaToNumber(order.deliveryPrice)}원</Text>
                                </View>

                                <View className="mb-3 flex-row">
                                    <Text className="w-28 text-gray-300">정산 여부</Text>
                                    <Text className={`font-semibold ${order.isSettlement ? "font-color" : "color-danger"}`}>{order.isSettlement ? "정산" : "미정산"}</Text>
                                </View>
                            </View>
                            <View className="mt-4 h-[10px] bg-gray-700" />
                            <View className="mt-4 p-4">
                                <Text className="mb-3 text-lg font-semibold font-color-sub">이동 정보</Text>
                                {order.orderLocations.map((location) => (
                                    <View className={"mb-4"} key={'order_location_' + location.uid}>
                                        <View className="mb-3 flex-row">
                                            <Text className="w-28 text-gray-300">이름</Text>
                                            <Text className="font-semibold text-white">{location.name}</Text>
                                        </View>
                                        <View className="mb-3 flex-row">
                                            <Text className="w-28 text-gray-300">차량번호</Text>
                                            <Text className="font-semibold text-white">{location.carNumber || "-"}</Text>
                                        </View>
                                        <View className="mb-3 flex-row">
                                            <Text className="w-28 text-gray-300">장소</Text>
                                            <Text className="flex-1 font-semibold text-white">{location.typeName || '없음'}</Text>
                                        </View>
                                        <View className="mb-3 flex-row">
                                            <Text className="w-28 text-gray-300">도로명 주소</Text>
                                            <Text className="flex-1 font-semibold text-white">{location.roadAddress || '없음'}</Text>
                                        </View>
                                        <View className="mb-3 flex-row">
                                            <Text className="w-28 text-gray-300">지번 주소</Text>
                                            <Text className="flex-1 font-semibold text-white">{location.jibunAddress || '없음'}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <View className="mt-4 h-[10px] bg-gray-700" />
                            <View className={"mt-4 p-4"}>
                                <Text className="mb-3 text-lg font-semibold font-color-sub">추가 정보</Text>
                                {order.orderSettlements.map((settlement) => (
                                    <View className={"mb-4"} key={'order_settlement_' + settlement.uid}>
                                        <View className="mb-3 flex-row">
                                            <Text className="w-28 text-gray-300">요금 종류</Text>
                                            <Text className="font-semibold text-white">{settlement.typeName}</Text>
                                        </View>
                                        <View className="mb-3 flex-row">
                                            <Text className="w-28 text-gray-300">금액</Text>
                                            <Text className="font-semibold text-white">{addCommaToNumber(settlement.price)}원</Text>
                                        </View>
                                        { settlement.type === 'STAY' && (
                                            <View className="mb-3 flex-row">
                                                <Text className="w-28 text-gray-300">대기시간</Text>
                                                <Text className="flex-1 font-semibold text-white">{secondToTimeHangul(settlement.waitTime)}</Text>
                                            </View>
                                        )}
                                        {settlement.type === "WAYPOINT" && (
                                            <View className="mb-3 flex-row">
                                                <Text className="w-28 text-gray-300">추가거리</Text>
                                                <Text className="flex-1 font-semibold text-white">{mToKm(settlement.wayPointDistance)}</Text>
                                            </View>
                                        )}
                                        <View className="mb-3 flex-row">
                                            <Text className="w-28 text-gray-300">비고</Text>
                                            <Text className="flex-1 font-semibold text-white">{settlement.comment || '없음'}</Text>
                                        </View>
                                    </View>
                                ))}
                                {order.orderSettlements.length === 0 && (
                                    <View className="flex-row mb-8">
                                        <Text className={"font-semibold text-white font-lg"}>추가 정보가 없습니다.</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )
    )
}