import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

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

// 거리에 따른 예상 시간 계산 (km당 평균 2분 가정, 최소 15분)
const calculateTime = distance => {
  const km = parseInt(distance);
  const minutes = Math.max(15, km * 2);
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
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

export default function TaksongListScreen() {
  const renderItem = ({ item }) => {
    const statusColors = getStatusColor(item.status);

    const handlePress = () => {
      router.push(`/(protected)/taksongs/${item.id}`);
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="mx-4 mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
      >
        {/* 상태 배지 */}
        <View className="mb-3 flex-row items-center justify-between">
          <View
            className={`rounded-full border px-3 py-1 ${
              item.status === STATUS.COMPLETED
                ? 'border-green-300 bg-green-100'
                : item.status === STATUS.CANCELLED
                  ? 'border-red-300 bg-red-100'
                  : item.status === STATUS.ASSIGNED
                    ? 'border-blue-300 bg-blue-100'
                    : item.status === STATUS.PENDING
                      ? 'border-yellow-300 bg-yellow-100'
                      : 'border-purple-300 bg-purple-100'
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                item.status === STATUS.COMPLETED
                  ? 'text-green-700'
                  : item.status === STATUS.CANCELLED
                    ? 'text-red-700'
                    : item.status === STATUS.ASSIGNED
                      ? 'text-blue-700'
                      : item.status === STATUS.PENDING
                        ? 'text-yellow-700'
                        : 'text-purple-700'
              }`}
            >
              {item.status}
            </Text>
          </View>
          {item.vehicleNumber && (
            <View className="rounded-full bg-gray-100 px-3 py-1">
              <Text className="text-xs font-medium text-gray-700">🚗 {item.vehicleNumber}</Text>
            </View>
          )}
        </View>

        {/* 출발지 */}
        <View className="mb-2 flex-row items-start">
          <View className="mr-3 mt-2 h-2 w-2 rounded-full bg-green-500" />
          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-500">출발지</Text>
            <Text className="text-sm font-medium leading-5 text-gray-900">{item.departure}</Text>
          </View>
        </View>

        {/* 도착지 */}
        <View className="mb-3 flex-row items-start">
          <View className="mr-3 mt-2 h-2 w-2 rounded-full bg-red-500" />
          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-500">도착지</Text>
            <Text className="text-sm font-medium leading-5 text-gray-900">{item.destination}</Text>
          </View>
        </View>

        {/* 구분선 */}
        <View className="mt-1 border-t border-gray-100 pt-3">
          <View className="flex-row items-center justify-between">
            {/* 거리 & 시간 */}
            <View className="flex-row items-center">
              <View className="mr-4">
                <Text className="mb-1 text-xs text-gray-500">거리</Text>
                <Text className="font-semibold text-gray-900">{item.distance}</Text>
              </View>
              <View>
                <Text className="mb-1 text-xs text-gray-500">소요시간</Text>
                <Text className="font-semibold text-gray-900">{item.time}</Text>
              </View>
            </View>

            {/* 요금 */}
            <View className="items-end">
              <Text className="mb-1 text-xs text-gray-500">요금</Text>
              <Text className="text-lg font-bold text-red-600">{item.price}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 상태별 통계 계산
  const statusCounts = mockTaksongs.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <View className=" bg-gray-50">
      {/* 상태 통계 */}
      <View className="bg-gray-50">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-b border-gray-200 bg-white p-4 "
        >
          {Object.entries(statusCounts).map(([status, count]) => (
            <View
              key={status}
              className={`mr-2 rounded-lg border p-2 ${
                status === STATUS.COMPLETED
                  ? 'border-green-300 bg-green-100'
                  : status === STATUS.CANCELLED
                    ? 'border-red-300 bg-red-100'
                    : status === STATUS.ASSIGNED
                      ? 'border-blue-300 bg-blue-100'
                      : status === STATUS.PENDING
                        ? 'border-yellow-300 bg-yellow-100'
                        : 'border-purple-300 bg-purple-100'
              }`}
            >
              <Text className="text-sm font-medium">
                {status} ({count})
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 목록 */}
      <FlatList
        data={mockTaksongs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
