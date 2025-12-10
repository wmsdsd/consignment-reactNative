import { FlatList, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '@/app/context/AppContext';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 가짜 요금 데이터
const mockPrices = [
    {
        id: '1',
        route: '서울 ↔ 인천공항',
        distance: '58km',
        time: '1시간 56분',
        basePrice: '65,000원',
        vehicleType: '일반',
        description: '서울 주요 지역에서 인천국제공항까지',
    },
    {
        id: '2',
        route: '서울 ↔ 김포공항',
        distance: '28km',
        time: '56분',
        basePrice: '35,000원',
        vehicleType: '일반',
        description: '서울 주요 지역에서 김포국제공항까지',
    },
    {
        id: '3',
        route: '서울 시내',
        distance: '12km',
        time: '24분',
        basePrice: '18,000원',
        vehicleType: '일반',
        description: '서울 시내 주요 지역 간 이동',
    },
    {
        id: '4',
        route: '서울 ↔ 경기',
        distance: '35km',
        time: '1시간 10분',
        basePrice: '42,000원',
        vehicleType: '일반',
        description: '서울과 경기도 주요 지역 간 이동',
    },
    {
        id: '5',
        route: '서울 시내 (단거리)',
        distance: '8km',
        time: '16분',
        basePrice: '12,000원',
        vehicleType: '일반',
        description: '서울 시내 단거리 이동',
    },
    {
        id: '6',
        route: '서울 ↔ 부산',
        distance: '325km',
        time: '10시간 50분',
        basePrice: '280,000원',
        vehicleType: '대형',
        description: '서울에서 부산까지 장거리 이동',
    },
    {
        id: '7',
        route: '서울 ↔ 대전',
        distance: '167km',
        time: '2시간 30분',
        basePrice: '150,000원',
        vehicleType: '중형',
        description: '서울에서 대전까지 중거리 이동',
    },
    {
        id: '8',
        route: '서울 ↔ 대구',
        distance: '300km',
        time: '4시간',
        basePrice: '250,000원',
        vehicleType: '대형',
        description: '서울에서 대구까지 장거리 이동',
    },
    {
        id: '9',
        route: '서울 ↔ 광주',
        distance: '267km',
        time: '3시간 30분',
        basePrice: '220,000원',
        vehicleType: '대형',
        description: '서울에서 광주까지 장거리 이동',
    },
    {
        id: '10',
        route: '서울 ↔ 수원',
        distance: '45km',
        time: '1시간 30분',
        basePrice: '52,000원',
        vehicleType: '일반',
        description: '서울에서 수원까지 이동',
    },
];

const vehicleTypeColor = {
    일반: 'bg-blue-600',
    중형: 'bg-green-600',
    대형: 'bg-purple-600',
};

function PriceCard({ item }) {
    const handlePress = () => {
        router.push(`/(protected)/prices/${item.uid}`);
    };
    
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className="mb-4 w-full rounded-xl bg-[#1E1E1E] p-4"
        >
            {/* 상단 Row */}
            <View className="mb-2 flex-row items-center justify-between">
                <View
                    className={`rounded-md px-3 py-1 ${vehicleTypeColor[item.vehicleType] || 'bg-gray-600'}`}
                >
                    <Text className="text-xs font-semibold text-white">{item.vehicleType}</Text>
                </View>
                
                <Text className="text-xl font-bold text-white">{item.basePrice}</Text>
            </View>
            
            {/* 노선명 */}
            <View className="mb-2">
                <Text className="text-lg font-semibold text-white">{item.route}</Text>
            </View>
            
            {/* 거리/시간 */}
            <View className="mb-2 flex-row items-center">
                <Text className="text-sm text-gray-300">
                    {item.distance} | {item.time}
                </Text>
            </View>
            
            {/* 설명 */}
            <View>
                <Text className="text-sm text-gray-400">{item.description}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function PricesListScreen() {
    const { menuConfig } = useAppContext()
    const insets = useSafeAreaInsets()

    const [id, setId] = useState(null)

    useEffect(() => {
        setId(menuConfig.orderUid)


    }, [menuConfig.orderUid])

    const renderItem = ({ item }) => <PriceCard item={item} />

    const moveToBill = () => {
        router.push(`/(protected)/prices/${item.uid}/bill`)
    }
    
    return (
        <View className={"flex-1 bg-black"}>
            <View className={"flex-1"}>
                <FlatList
                    data={mockPrices}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
                    className="flex-1 bg-black"
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View
                className={"border-t border-gray-800 bg-black p-4"}
                style={{ paddingBottom: Math.max(insets.bottom, 60) }}
            >
                <Pressable onPress={moveToBill} className="flex-1 rounded-xl bg-btn py-4">
                    <Text className="text-center text-lg font-semibold text-white">요금 청구</Text>
                </Pressable>
            </View>
        </View>
    )
}
