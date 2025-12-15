import { View, Text, Animated, TouchableOpacity, Pressable, Alert, Platform, Linking } from 'react-native'
import { useLocalSearchParams, router, useNavigation } from 'expo-router'
import {useContext, useEffect, useMemo, useRef, useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useDriverMove, useOrder, useOrderLocationProcess, useOrderLocationStart } from '@/hooks/useApi';
import { formatDate, formatPhone, formatTime } from '@/lib/utils';
import IconButton from '@/components/IconButton'
import moment from 'moment'
import { useForegroundLocation, getLocation } from '@/hooks/useLocation'
import { useAppContext } from '@/app/context/AppContext';

export default function ConfirmScreen() {
    const navigation = useNavigation()
    const { setMenuConfig } = useAppContext()

    const { id } = useLocalSearchParams()
    const { data: order } = useOrder(id)
    const { data: orderLocation , refetch: refetchOrderLocation } = useOrderLocationProcess(id)

    useForegroundLocation({
        orderUid: order?.uid,
        orderLocationUid: orderLocation?.uid
    })

    const isWait = useMemo(() => {
        return orderLocation?.status === 'WAIT'
    }, [orderLocation?.status])
    
    // 날짜와 시간 상태 관리
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    
    const startMutation = useOrderLocationStart()
    const driverMoveMutation = useDriverMove()

    // 날짜 선택 핸들러
    const handleDateChange = (event, date) => {
        setShowDatePicker(false)
        if (date) {
            const newDate = new Date(date)
            newDate.setHours(selectedDate.getHours())
            newDate.setMinutes(selectedDate.getMinutes())
            setSelectedDate(newDate)
        }
    };
    
    // 시간 선택 핸들러
    const handleTimeChange = (event, date) => {
        setShowTimePicker(false)
        if (date) {
            const newDate = new Date(selectedDate)
            newDate.setHours(date.getHours())
            newDate.setMinutes(date.getMinutes())
            setSelectedDate(newDate)
        }
    }
    
    // 운행 시작
    const handleTransportStart = async () => {
        const arrivedAt = moment(selectedDate.toISOString()).format('YYYY-MM-DD HH:mm:ss')
        const res = await startMutation.mutateAsync({
            orderUid: id,
            orderLocationUid: orderLocation.uid,
            arrivedAt: arrivedAt,
        })
        if (res) {
            await refetchOrderLocation()

            const coords = await getLocation()
            if (coords) {
                await driverMoveMutation.mutateAsync({
                    name: `[${orderLocation.typeName}] 탁송 기사 출발`,
                    type: "HISTORY",
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    orderUid: id,
                    orderLocationUid: orderLocation.uid,
                })
            }
        }
    }
    
    // 도착 및 사진 촬영
    const handleMoveToPrepare = () => {
        router.push({
            pathname: `/(protected)/taksongs/${id}/prepare`
        })
    }
    
    // 네비게이션 앱 열기 핸들러
    const handleOpenNavigation = async () => {
        const address = orderLocation.roadAddress || orderLocation.jibunAddress || '미등록 장소'
        const goalName = encodeURIComponent(address)
        const goalX = orderLocation.longitude // 경도
        const goalY = orderLocation.latitude // 위도
        
        // 사용자에게 앱 선택 옵션 제공
        Alert.alert(
            '네비게이션 앱 선택',
            '사용할 네비게이션 앱을 선택해주세요',
            [
                {
                    text: 'TMap',
                    onPress: async () => {
                        // TMap은 goalname, goalx, goaly 파라미터 사용
                        const tmapUrl = `tmap://route?goalname=${goalName}&goalx=${goalX}&goaly=${goalY}`;
                        try {
                            const canOpen = await Linking.canOpenURL(tmapUrl);
                            if (canOpen) {
                                await Linking.openURL(tmapUrl);
                            } else {
                                // TMap이 설치되어 있지 않은 경우 앱스토어로 이동
                                const storeUrl = Platform.select({
                                    ios: 'https://apps.apple.com/kr/app/tmap/id431589174',
                                    android: 'market://details?id=com.skt.tmap.ku',
                                });
                                if (storeUrl) {
                                    await Linking.openURL(storeUrl);
                                }
                            }
                        } catch (error) {
                            console.error('TMap 열기 오류:', error);
                            Alert.alert('오류', 'TMap을 열 수 없습니다.');
                        }
                    },
                },
                {
                    text: '카카오맵',
                    onPress: async () => {
                        // 카카오맵은 ep(위도,경도)와 by(이동수단) 파라미터 사용
                        const kakaoMapUrl = `kakaomap://route?ep=${goalY},${goalX}&by=CAR`;
                        try {
                            const canOpen = await Linking.canOpenURL(kakaoMapUrl);
                            if (canOpen) {
                                await Linking.openURL(kakaoMapUrl);
                            } else {
                                // 카카오맵이 설치되어 있지 않은 경우 앱스토어로 이동
                                const storeUrl = Platform.select({
                                    ios: 'https://apps.apple.com/kr/app/kakaomap/id304608425',
                                    android: 'market://details?id=net.daum.android.map',
                                });
                                if (storeUrl) {
                                    await Linking.openURL(storeUrl);
                                }
                            }
                        } catch (error) {
                            console.error('카카오맵 열기 오류:', error);
                            Alert.alert('오류', '카카오맵을 열 수 없습니다.');
                        }
                    },
                },
                {
                    text: '취소',
                    style: 'cancel',
                },
            ],
            { cancelable: true },
        );
    }
    
    const handleCall = () => {
        if (orderLocation.phone) {
            const url = `tel:${orderLocation.phone}`
            Linking.openURL(url).catch((error) => {
                console.error('전화 연결 오류:', error)
                Alert.alert('전화연결 오류', '전화연결에 실패하였습니다.')
            })
        }
        else {
            Alert.alert('오류', '연락처가 존재하지 않습니다.')
        }
    }

    useEffect(() => {
        const arrivedAt = orderLocation?.arrivedAt
        if (arrivedAt) {
            const date = new Date(arrivedAt)
            setSelectedDate(date)
        }
        
        navigation.setOptions({
            title: orderLocation?.typeName || '차량 이동'
        })


        setMenuConfig(prev => ({
            ...prev,
            direction: 'right',
            orderUid: id
        }))

    }, [])

    if (!order || !orderLocation) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-lg text-white">탁송 정보를 찾을 수 없습니다.</Text>
                <TouchableOpacity
                    onPress={() => {
                        router.replace("/(protected)/taksongs")
                    }}
                    className="mt-4 rounded-lg bg-blue-500 px-6 py-3"
                >
                    <Text className="font-semibold text-white">목록으로 돌아가기</Text>
                </TouchableOpacity>
            </View>
        )
    }
    
    return (
        <View className="flex-1 bg-black">
            <View className="flex-1 px-4">
                <View className="flex-1 mt-6">
                    <Text className="mb-3 text-lg font-semibold text-white">이동 정보</Text>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">이름</Text>
                        <Text className="font-semibold text-white">{orderLocation.name}</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">차량번호</Text>
                        <Text className="font-semibold text-white">{orderLocation.carNumber || '-'}</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">연락처</Text>
                        <Text className="font-semibold text-white">{formatPhone(orderLocation.phone)}</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">도로명 주소</Text>
                        <Text className="flex-1 font-semibold text-white">{orderLocation.roadAddress || '없음'}</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">지번 주소</Text>
                        <Text className="flex-1 font-semibold text-white">{orderLocation.jibunAddress || '없음'}</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">상태</Text>
                        <Text className="font-semibold text-white">{orderLocation.statusName}</Text>
                    </View>
                </View>

                <View className="my-5 h-[1px] bg-gray-700" />

                {/* 도착예정일시 */}
                <View className="mb-6">
                    <Text className="mb-4 text-lg font-semibold text-white">도착예정일시</Text>

                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => setShowDatePicker(true)}
                            disabled={!isWait}
                            className="flex-1 rounded-xl bg-white px-4 py-3 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                        >
                            <Text className="text-base font-medium text-black">{formatDate(selectedDate)} ▼</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setShowTimePicker(true)}
                            disabled={!isWait}
                            className="flex-1 rounded-xl bg-white px-4 py-3 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                        >
                            <Text className="text-base font-medium text-black">{formatTime(selectedDate)} ▼</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* DatePicker */}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* TimePicker */}
            {showTimePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                    is24Hour={false}
                />
            )}

            {/* 하단 버튼 */}
            <View className="bg-black px-4 pb-20 pt-4">
                { !isWait && (
                    <View className={"flex flex-row gap-2"}>
                        <View className={"bg-default flex justify-center items-center w-[60] rounded-lg"}>
                            <IconButton onPress={handleOpenNavigation} name={"location"} />
                        </View>
                        <View className={"bg-default flex justify-center items-center w-[60] rounded-lg"}>
                            <IconButton onPress={handleCall} name={"call"} />
                        </View>
                        <Pressable onPress={handleMoveToPrepare} className="flex-1 w-full rounded-xl bg-btn py-4">
                            <Text className="text-center text-xl font-semibold text-white">도착 및 사진촬영</Text>
                        </Pressable>
                    </View>
                )}
                { isWait && (
                    <Pressable onPress={handleTransportStart} className="w-full rounded-xl bg-btn py-4">
                        <Text className="text-center text-xl font-semibold text-white">운행 시작</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
