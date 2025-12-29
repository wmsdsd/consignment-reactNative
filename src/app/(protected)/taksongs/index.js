import { ActivityIndicator, Alert, FlatList, Text } from 'react-native';
import TaksongCard from '../../../components/TaksongCard';
import { useDriverSetToken, useOrderList } from '@/hooks/useApi';
import { getAddress } from '@/lib/utils';
import { useCallback, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { checkAllPermissionsAsync } from '@/lib/permissions';
import { syncPushToken } from '@/lib/notification';
import {useAuth} from "@/hooks/useAuth";

export default function TaksongListScreen() {
    const { user } = useAuth()
    const { data, isLoading, refetch } = useOrderList()
    const { setMenuConfig } = useAppContext()
    const navigation = useNavigation()

    const setTokenMutation = useDriverSetToken()

    const onHandlePress = async (uid, status) => {
        switch (status) {
            case "DRIVER_ASSIGN":   // 기사 배정
                router.push(`/(protected)/taksongs/${uid}`)
                break
            case "DRIVER_RECEIVE":  // 배정 완료
            case "DRIVER_START":    // 출발지
            case "DRIVER_MIDDLE":   // 경유지
            case "DRIVER_END":      // 도착지
            case "DRIVER_ROUND":    // 왕복지
                const permission = await checkAllPermissionsAsync()
                if (permission?.allGranted) {
                    router.push(`/(protected)/taksongs/${uid}/confirm`)
                }
                else {
                    Alert.alert('권한이 필요합니다', '위치, 카메라, 사진 접근 권한을 모두 허용해주세요.')
                }
                break
            case "DISPUTE":         // 분쟁중
                router.push(`/(protected)/accident/${uid}/update`)
                break
        }
    }

    const renderItem = ({ item }) => {
        const orderLocations = item.orderLocations
        const startLocation = orderLocations.find(e => e.type === "START")
        const endLocation = orderLocations.find(e => e.type === "END")

        return (
            <TaksongCard
                id={item.uid}
                status={item.status}
                price={item.driverPrice}
                carNumber={item.carNumber}
                distance={item.distance}
                duration={item.time}
                start={getAddress(startLocation)}
                end={getAddress(endLocation)}
                isRound={item.isRound}
                carModel={item.carModelName}
                carBrand={item.carBrandName}
                handler={onHandlePress}
            />
        )
    }
    
    const renderEmptyList = () => {
        return <Text style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>담당 탁송 내역이 없습니다.</Text>
    }

    useFocusEffect(
        useCallback(() => {
            setMenuConfig(prev => ({
                ...prev,
                direction: 'left',
            }))
            refetch()
        }, [])
    )

    useEffect(() => {
        ;(async () => {
            const updateFlag = !!user?.token
            await syncPushToken(setTokenMutation, updateFlag)
        })()

        //todo: 이승준 - location (위치) 권한 확인
        // ;(async () => {
        //     console.log(
        //         'FG:',
        //         await Location.getForegroundPermissionsAsync(),
        //         'BG:',
        //         await Location.getBackgroundPermissionsAsync()
        //     );
        // })()
    }, [])

    useEffect(() => {
        const list = data || []
        let title = "탁송 목록"
        if (list.length > 0) {
            title += ` (${list.length})`
        }

        navigation.setOptions({
            title: title
        })
    }, [data])


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
