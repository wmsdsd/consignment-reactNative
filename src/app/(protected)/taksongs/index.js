import { ActivityIndicator, FlatList, Text } from 'react-native';
import TaksongCard from '../../../components/TaksongCard';
import { useOrderList } from '@/hooks/useApi'
import { getAddress } from '@/lib/utils';

export default function TaksongListScreen() {
    const { data, isLoading, refetch } = useOrderList()
    
    const renderItem = ({ item }) => {
        const orderLocations = item.orderLocations
        const startLocation = orderLocations.find(e => e.type === "START")
        const endLocation = orderLocations.find(e => e.type === "END")
        
        return (
            <TaksongCard
                id={item.uid}
                status={item.status}
                price={item.price}
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
    
    return (
        isLoading
            ? (<ActivityIndicator size="large" color="#0000ff" />)
            : (
                <FlatList
                    data={data.data || []}
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
