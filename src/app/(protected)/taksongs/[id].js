import { View, Text, Pressable, Alert, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkAllPermissionsAsync } from '../../../lib/utils';

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
            return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
        case STATUS.CANCELLED:
            return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
        case STATUS.ASSIGNED:
            return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
        case STATUS.PENDING:
            return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
        case STATUS.PICKUP:
            return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
};

// 가짜 탁송 데이터 (taksongs.js와 동일한 데이터)
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

export default function TaksongDetailScreen() {
    const { id } = useLocalSearchParams();
    const taksong = mockTaksongs.find(item => item.id === id);
    const insets = useSafeAreaInsets();
    
    // 배정 취소 핸들러
    const handleCancel = () => {
        Alert.alert('배정 취소', '정말 배정을 취소하시겠습니까?', [
            { text: '취소', style: 'cancel' },
            {
                text: '확인',
                style: 'destructive',
                onPress: () => {
                    // TODO: 배정 취소 API 호출
                    Alert.alert('완료', '배정이 취소되었습니다.');
                    router.back();
                },
            },
        ]);
    };
    
    // 탁송 시작 핸들러 - 예약 확인 페이지로 이동
    
    const handleStart = async () => {
        const result = await checkAllPermissionsAsync();
        
        if (result?.allGranted) {
            // ✅ 모든 권한 허용 → 다음 화면으로 이동
            router.push(`/(protected)/taksongs/${id}/confirm`);
        } else {
            // ❌ 하나라도 거부됨 → 경고 표시
            Alert.alert('권한이 필요합니다', '위치, 카메라, 사진 접근 권한을 모두 허용해주세요.');
        }
    };
    
    if (!taksong) {
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
    
    // 주소에서 시/도만 추출하는 헬퍼 함수
    const getCityName = address => {
        const match = address.match(/^([가-힣]+(?:시|도|특별시|광역시))/);
        return match ? match[1] : address;
    };
    
    return (
        <View className="flex-1 bg-black">
            <View className="flex-1 p-4">
                <View className="flex-1">
                    {/* 카드 */}
                    <View className="w-full flex-1 items-center justify-center rounded-2xl bg-neutral-900 p-6">
                        {/* 차량 번호 */}
                        <Text className="text-center text-4xl font-bold text-white">
                            {taksong.vehicleNumber || '미배정'}
                        </Text>
                        
                        {/* 거리 및 시간 */}
                        <View className="mt-5 flex-row justify-center gap-4">
                            <Text className="text-xl text-gray-300">{taksong.distance}</Text>
                            <Text className="text-lg text-gray-600">|</Text>
                            <Text className="text-xl text-gray-300">{taksong.time}</Text>
                        </View>
                        
                        {/* 출발 */}
                        <View className="mt-7 items-center">
                            <Text className="mb-2 rounded-md bg-green-600 px-3 py-1.5 text-sm text-white">
                                출발
                            </Text>
                            <Text className="text-3xl font-bold text-white">
                                {getCityName(taksong.departure)}
                            </Text>
                        </View>
                        
                        {/* 화살표 */}
                        <View className="my-7 items-center">
                            <Image
                                source={require('../../../../assets/arrow.png')}
                                className="h-20 w-20"
                                resizeMode="contain"
                            />
                        </View>
                        
                        {/* 도착 */}
                        <View className="items-center">
                            <Text className="mb-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white">
                                도착
                            </Text>
                            <Text className="text-3xl font-bold text-white">
                                {getCityName(taksong.destination)}
                            </Text>
                        </View>
                    </View>
                    
                    {/* 하단 요금 */}
                    <View
                        className="mt-4 w-full flex-row items-center justify-between rounded-xl border border-purple-700 bg-black p-4">
                        <Text className="text-lg text-gray-300">탁송비</Text>
                        <Text className="text-2xl font-semibold text-white">{taksong.price}</Text>
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
                    
                    <Pressable onPress={handleStart} className="flex-1 rounded-xl bg-purple-700 py-4">
                        <Text className="text-center text-lg font-semibold text-white">탁송 시작</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
