import { ActivityIndicator, FlatList, Text } from 'react-native';
import TaksongCard from '../../../components/TaksongCard';
import { useOrderList } from '@/hooks/useApi'
import { getAddress } from '@/lib/utils';
import { useCallback, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useFocusEffect } from 'expo-router';

export default function TaksongListScreen() {
    const { data, isLoading, refetch } = useOrderList()
    const { setMenuConfig } = useAppContext()
    
    const renderItem = ({ item }) => {
        const orderLocations = item.orderLocations
        const startLocation = orderLocations.find(e => e.type === "START")
        const endLocation = orderLocations.find(e => e.type === "END")

        return (
            <TaksongCard
                id={item.uid}
                status={item.status}
                price={item.deliveryPrice}
                carNumber={item.carNumber}
                distance={item.distance}
                duration={item.time}
                start={getAddress(startLocation)}
                end={getAddress(endLocation)}
                isRound={item.isRound}
            />
        )
    }
    
    const renderEmptyList = () => {
        return <Text style={{ textAlign: 'center', marginTop: 20 }}>담당 탁송 내역이 없습니다.</Text>
    }

    useFocusEffect(
        useCallback(() => {
            console.log("use callback call")
            setMenuConfig(prev => ({
                ...prev,
                direction: 'left',
            }))
        }, [])
    )

    return (
        isLoading
            ? (<ActivityIndicator size="large" color="#0000ff" />)
            : (
                <FlatList
                    data={data || []}
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
