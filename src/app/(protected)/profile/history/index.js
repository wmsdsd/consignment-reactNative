import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useOrderHistory } from '@/hooks/useApi';
import { useEffect } from 'react';
import TaksongCard from '@/components/TaksongCard';
import { addCommaToNumber, dateFormatter, getAddress, mToKm, secondToTimeHangul } from '@/lib/utils';
import { router } from 'expo-router';

const typeColor = {
    "PICK_UP": "bg-primary",
    "DELIVERY": "bg-receive",
}

export default function HistoryScreen() {
    const { data: list, isLoading, refetch } = useOrderHistory()


    const onHandlePress = (uid) => {
        router.push({
            pathname: "profile/history/details",
            params: {
                id: uid
            }
        })
    }

    const renderEmptyList = () => {
        return <Text style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>탁송 완료 내역이 없습니다.</Text>
    }

    const renderItem = ({ item }) => {

        const handlePress = () => {
            onHandlePress(item.uid)
        }

        return (
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                className="mb-4 w-full rounded-xl bg-[#1E1E1E] p-4"
            >
                <View className="mb-2 flex-row items-center justify-between">
                    <View className={"flex flex-row items-center"}>
                        <View className={`rounded-md px-3 py-1 ${typeColor[item.deliveryType] || 'bg-gray-600'}`}>
                            <Text className="text-xs font-semibold text-white">{item.deliveryTypeName}</Text>
                        </View>
                    </View>
                    <Text className="text-xl font-bold text-white">{addCommaToNumber(item.deliveryPrice)}원</Text>
                </View>

                <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-white">
                        {item.carNumber ? `🚗 ${item.carNumber}` : '차량 배정 대기'}
                        {` [${item.carBrandName ?? "미정"}`}
                        {`/${item.carModelName ?? "없음"}]` }
                    </Text>
                    <Text className="text-base font-semibold text-white">{dateFormatter(item.expectedAt, "YYYY-MM-DD")}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        isLoading
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
            )
    )
}