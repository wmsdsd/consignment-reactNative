import {View, Text, ScrollView, TouchableOpacity, Pressable, Alert, Platform} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import * as Linking from 'expo-linking';
import {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useOrderLocationProcess} from "@/hooks/useApi";

// 상태 타입 정의
const STATUS = {
    COMPLETED: '예약 완료',
    CANCELLED: '예약 취소',
    ASSIGNED: '기사배정',
    PENDING: '예약 대기',
    PICKUP: '픽업 중',
};

// 상태별 색상
const getStatusColor = status => {
    switch (status) {
        case STATUS.COMPLETED:
            return {bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300'};
        case STATUS.CANCELLED:
            return {bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300'};
        case STATUS.ASSIGNED:
            return {bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300'};
        case STATUS.PENDING:
            return {bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300'};
        case STATUS.PICKUP:
            return {bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300'};
        default:
            return {bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300'};
    }
};

// 가짜 탁송 데이터
const mockTaksongs = [
    {
        id: '1',
        status: STATUS.COMPLETED,
        departure: '서울특별시 강남구 테헤란로 231',
        destination: '인천광역시 중구 공항로 272 인천국제공항',
        distance: '58km',
        time: '1시간 56분',
        price: '65,000원',
        vehicleNumber: '12가3456',
    },
    {
        id: '2',
        status: STATUS.ASSIGNED,
        departure: '서울특별시 마포구 홍익로 59 홍대입구역',
        destination: '서울특별시 강서구 하늘길 112 김포국제공항',
        distance: '28km',
        time: '56분',
        price: '35,000원',
        vehicleNumber: '34나5678',
    },
    {
        id: '3',
        status: STATUS.PENDING,
        departure: '서울특별시 광진구 능동로 120 건국대학교',
        destination: '서울특별시 중구 한강대로 405 서울역',
        distance: '12km',
        time: '24분',
        price: '18,000원',
        vehicleNumber: null,
    },
    {
        id: '4',
        status: STATUS.ASSIGNED,
        departure: '경기도 성남시 분당구 판교로 235 판교타워',
        destination: '서울특별시 송파구 올림픽로 240 잠실역',
        distance: '35km',
        time: '1시간 10분',
        price: '42,000원',
        vehicleNumber: '56다7890',
    },
    {
        id: '5',
        status: STATUS.PICKUP,
        departure: '서울특별시 용산구 이태원로 145 이태원역',
        destination: '서울특별시 강남구 강남대로 396 강남역',
        distance: '8km',
        time: '16분',
        price: '12,000원',
        vehicleNumber: '78라9012',
    },
    {
        id: '6',
        status: STATUS.COMPLETED,
        departure: '서울특별시 종로구 사직로 161 경복궁',
        destination: '서울특별시 중구 명동길 26 명동',
        distance: '5km',
        time: '15분',
        price: '10,000원',
        vehicleNumber: '90마1234',
    },
    {
        id: '7',
        status: STATUS.ASSIGNED,
        departure: '서울특별시 용산구 한강대로 23 용산역',
        destination: '부산광역시 동구 중앙대로 206 부산역',
        distance: '325km',
        time: '10시간 50분',
        price: '280,000원',
        vehicleNumber: '12바3456',
    },
    {
        id: '8',
        status: STATUS.COMPLETED,
        departure: '서울특별시 영등포구 여의공원로 68 여의도',
        destination: '인천광역시 중구 공항로 272 인천국제공항',
        distance: '52km',
        time: '1시간 44분',
        price: '58,000원',
        vehicleNumber: '34사5678',
    },
    {
        id: '9',
        status: STATUS.PENDING,
        departure: '서울특별시 마포구 상암동 상암중앙로 76',
        destination: '서울특별시 종로구 세종대로 175 광화문',
        distance: '15km',
        time: '30분',
        price: '20,000원',
        vehicleNumber: null,
    },
    {
        id: '10',
        status: STATUS.ASSIGNED,
        departure: '서울특별시 중구 을지로 281 동대문역사문화공원역',
        destination: '서울특별시 송파구 올림픽로 300 송파구청',
        distance: '18km',
        time: '36분',
        price: '25,000원',
        vehicleNumber: '56아7890',
    },
    {
        id: '11',
        status: STATUS.COMPLETED,
        departure: '서울특별시 성동구 성수일로8길 37 성수동',
        destination: '서울특별시 송파구 올림픽로 240 잠실역',
        distance: '7km',
        time: '15분',
        price: '11,000원',
        vehicleNumber: '78자9012',
    },
    {
        id: '12',
        status: STATUS.PICKUP,
        departure: '서울특별시 강동구 천호대로 1037 강동구청',
        destination: '서울특별시 강서구 하늘길 112 김포국제공항',
        distance: '42km',
        time: '1시간 24분',
        price: '48,000원',
        vehicleNumber: '90차1234',
    },
    {
        id: '13',
        status: STATUS.CANCELLED,
        departure: '서울특별시 서초구 서초대로 396 서초구청',
        destination: '경기도 부천시 원미구 시청로 30 부천시청',
        distance: '28km',
        time: '56분',
        price: '32,000원',
        vehicleNumber: null,
    },
    {
        id: '14',
        status: STATUS.ASSIGNED,
        departure: '서울특별시 마포구 월드컵북로 396 마포구청',
        destination: '경기도 수원시 영통구 월드컵로 206 수원역',
        distance: '45km',
        time: '1시간 30분',
        price: '52,000원',
        vehicleNumber: '12카3456',
    },
    {
        id: '15',
        status: STATUS.COMPLETED,
        departure: '서울특별시 노원구 상계로 571 노원구청',
        destination: '인천광역시 남동구 정각로 29 인천시청',
        distance: '55km',
        time: '1시간 50분',
        price: '62,000원',
        vehicleNumber: '34타5678',
    },
    {
        id: '16',
        status: STATUS.PENDING,
        departure: '서울특별시 금천구 시흥대로 73 금천구청',
        destination: '경기도 고양시 일산동구 중앙로 1200 일산역',
        distance: '38km',
        time: '1시간 16분',
        price: '45,000원',
        vehicleNumber: null,
    },
    {
        id: '17',
        status: STATUS.ASSIGNED,
        departure: '서울특별시 광진구 능동로 120 광진구청',
        destination: '경기도 의정부시 평화로 151 의정부역',
        distance: '25km',
        time: '50분',
        price: '30,000원',
        vehicleNumber: '56파7890',
    },
    {
        id: '18',
        status: STATUS.COMPLETED,
        departure: '서울특별시 은평구 은평로 195 은평구청',
        destination: '경기도 성남시 분당구 정자일로 95 분당역',
        distance: '32km',
        time: '1시간 4분',
        price: '38,000원',
        vehicleNumber: '78하9012',
    },
    {
        id: '19',
        status: STATUS.PICKUP,
        departure: '서울특별시 종로구 새문안로 68 종로구청',
        destination: '경기도 안산시 단원구 광덕로 165 안산역',
        distance: '48km',
        time: '1시간 36분',
        price: '55,000원',
        vehicleNumber: '90호1234',
    },
    {
        id: '20',
        status: STATUS.ASSIGNED,
        departure: '서울특별시 중구 세종대로 110 서울중앙우체국',
        destination: '경기도 고양시 덕양구 중앙로 415 고양시청',
        distance: '22km',
        time: '44분',
        price: '28,000원',
        vehicleNumber: '12허3456',
    },
];

export default function ConfirmScreen() {
    const {id} = useLocalSearchParams()
    const { data: orderLocation } = useOrderLocationProcess(id)

    const taksong = mockTaksongs.find(item => item.id === id);

    // 날짜와 시간 상태 관리
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // 날짜 포맷팅 함수
    const formatDate = date => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}년 ${month}월 ${day}일`;
    };

    // 시간 포맷팅 함수
    const formatTime = date => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${ampm} ${displayHours}:${displayMinutes}`;
    };

    // 날짜 선택 핸들러
    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            const newDate = new Date(date);
            newDate.setHours(selectedDate.getHours());
            newDate.setMinutes(selectedDate.getMinutes());
            setSelectedDate(newDate);
        }
    };

    // 시간 선택 핸들러
    const handleTimeChange = (event, date) => {
        setShowTimePicker(false);
        if (date) {
            const newDate = new Date(selectedDate);
            newDate.setHours(date.getHours());
            newDate.setMinutes(date.getMinutes());
            setSelectedDate(newDate);
        }
    };

    // 운송 시작 핸들러 - 차량 도착 사진 촬영 페이지로 이동
    const handleTransportStart = () => {
        router.push(`/(protected)/taksongs/${id}/prepare`);
    };

    // 네비게이션 앱 열기 핸들러
    const handleOpenNavigation = async () => {
        // 임시로 서울시청 좌표로 고정 (위도, 경도)
        const goalName = encodeURIComponent('서울시청');
        const goalX = 126.9783881; // 경도
        const goalY = 37.5666103; // 위도

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
            {cancelable: true}
        );
    };

    if (!taksong) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-lg text-white">탁송 정보를 찾을 수 없습니다.</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-4 rounded-lg bg-blue-500 px-6 py-3"
                >
                    <Text className="font-semibold text-white">목록으로 돌아가기</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <View className="flex-1 px-4">
                {/* 기본 정보 */}
                <View className="mt-6">
                    <Text className="mb-3 text-lg font-semibold text-white">기본 정보</Text>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">차량번호</Text>
                        <Text className="font-semibold text-white">{taksong.vehicleNumber || '-'}</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">특이사항</Text>
                        <Text className="font-semibold text-white">-</Text>
                    </View>
                </View>

                <View className="my-5 h-[1px] bg-gray-700"/>

                {/* 이동 정보 */}
                <View className="flex-1">
                    <Text className="mb-3 text-lg font-semibold text-white">이동 정보</Text>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">이름</Text>
                        <Text className="font-semibold text-white">-</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">연락처</Text>
                        <Text className="font-semibold text-white">-</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">도로명 주소</Text>
                        <Text className="flex-1 font-semibold text-white">{taksong.destination}</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">지번 주소</Text>
                        <Text className="flex-1 font-semibold text-white">{taksong.departure}</Text>
                    </View>

                    <View className="mb-3 flex-row">
                        <Text className="w-28 text-gray-300">상태</Text>
                        <Text className="font-semibold text-white">{taksong.status}</Text>
                    </View>
                </View>

                <View className="my-5 h-[1px] bg-gray-700"/>

                {/* 도착예정일시 */}
                <View className="mb-6">
                    <Text className="mb-4 text-lg font-semibold text-white">도착예정일시</Text>

                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => setShowDatePicker(true)}
                            className="flex-1 rounded-xl bg-white px-4 py-3"
                        >
                            <Text className="text-base font-medium text-black">{formatDate(selectedDate)} ▼</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setShowTimePicker(true)}
                            className="flex-1 rounded-xl bg-white px-4 py-3"
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
                <Pressable onPress={handleTransportStart} className="w-full rounded-xl bg-purple-700 py-4">
                    <Text className="text-center text-xl font-semibold text-white">운행 시작</Text>
                </Pressable>
            </View>
        </View>
    );
}
