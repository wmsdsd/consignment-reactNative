import { FlatList, View, Text, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addCommaToNumber, mToKm, secondToTimeHangul } from '@/lib/utils';
import { useOrderSettlementList } from '@/hooks/useApi';

const typeColor = {
    ORDER: "bg-blue-600",        // 탁송
    ROUND: "bg-indigo-600",      // 왕복
    CANCEL: "bg-red-600",        // 취소
    STAY: "bg-yellow-600",       // 대기
    WAYPOINT: "bg-teal-600",     // 경유
    OIL: "bg-amber-600",         // 주유
    TOLLGATE: "bg-slate-600",    // 통행료(톨비)
    WASH: "bg-cyan-600",         // 세차
    ETC: "bg-gray-600",          // 기타
}

function PriceCard({ item }) {
    const handlePress = () => {
        router.push(`/(protected)/prices/${item.uid}`)
    }
    const isStay = item.type === "STAY"
    const isWay = item.type === "WAYPOINT"
    
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className="mb-4 w-full rounded-xl bg-[#1E1E1E] p-4"
        >
            {/* 상단 Row */}
            <View className="mb-2 flex-row items-center justify-between">
                <View
                    className={`rounded-md px-3 py-1 ${typeColor[item.type] || 'bg-gray-600'}`}
                >
                    <Text className="text-xs font-semibold text-white">{item.typeName}</Text>
                </View>
                <Text className="text-xl font-bold text-white">{addCommaToNumber(item.price)}</Text>
            </View>

            {/*거리/시간 */}
            { (isStay || isWay) && (
                <View className="mb-2 flex-row items-center">
                    { isStay && (
                        <Text className="text-sm text-gray-300">대기시간: {secondToTimeHangul(item.waitTime)}</Text>
                    )}
                    {isWay && (
                        <Text className="text-sm text-gray-300">거리: {mToKm(item.wayPointDistance)}</Text>
                    )}
                </View>
            ) }

            {/* 설명 */}
            <View>
                <Text className="text-sm text-gray-400">{item.comment || "없음"}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function PricesListScreen() {
    const { menuConfig } = useAppContext()
    const insets = useSafeAreaInsets()

    const [id, setId] = useState(null)
    const [loading, setLoading] = useState(false)
    const { data: list, isLoading, refetch } = useOrderSettlementList(id)

    useEffect(() => {
        setId(menuConfig.orderUid)
    }, [menuConfig.orderUid])

    useFocusEffect(
        useCallback(() => {
            (async () => {
                await refetch()
            })()
        }, [])
    )

    const renderItem = ({ item }) => <PriceCard item={item} />

    const moveToBill = () => {
        if (loading) return

        setLoading(true)
        try {
            router.push(`/(protected)/prices/${id}/bill`)
        }
        finally {
            setLoading(false)
        }
    }

    const renderEmptyList = () => {
        return <Text style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>요금 청구 내역이 없습니다.</Text>
    }

    return (
        <View className={"flex-1 bg-black"}>
            <View className={"flex-1 px-4"}>
                {isLoading
                ? (<ActivityIndicator size="large" color="#0000ff" />)
                : (
                    <FlatList
                        data={list || []}
                        renderItem={renderItem}
                        keyExtractor={item => item.uid}
                        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
                        className="flex-1 bg-black"
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={renderEmptyList}
                        refreshing={isLoading}
                        onRefresh={refetch}
                    />
                )}
            </View>
            <View
                className={"border-t border-gray-800 bg-black p-4"}
                style={{ paddingBottom: Math.max(insets.bottom, 60) }}
            >
                <View className={"w-full flex-row"}>
                    <Pressable onPress={moveToBill} className="flex-1 rounded-xl bg-btn py-4">
                        <Text className="text-center text-lg font-semibold text-white">요금 청구</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}
