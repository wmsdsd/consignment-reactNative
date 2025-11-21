import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
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
    details: {
      baseFare: '50,000원',
      distanceFare: '10,000원',
      timeFare: '5,000원',
      total: '65,000원',
    },
    additionalInfo: ['야간 할증 (22시~06시): +20%', '공항 할증: +10,000원', '고속도로 통행료 별도'],
  },
  {
    id: '2',
    route: '서울 ↔ 김포공항',
    distance: '28km',
    time: '56분',
    basePrice: '35,000원',
    vehicleType: '일반',
    description: '서울 주요 지역에서 김포국제공항까지',
    details: {
      baseFare: '25,000원',
      distanceFare: '5,000원',
      timeFare: '5,000원',
      total: '35,000원',
    },
    additionalInfo: ['야간 할증 (22시~06시): +20%', '공항 할증: +10,000원', '고속도로 통행료 별도'],
  },
  {
    id: '3',
    route: '서울 시내',
    distance: '12km',
    time: '24분',
    basePrice: '18,000원',
    vehicleType: '일반',
    description: '서울 시내 주요 지역 간 이동',
    details: {
      baseFare: '12,000원',
      distanceFare: '3,000원',
      timeFare: '3,000원',
      total: '18,000원',
    },
    additionalInfo: ['야간 할증 (22시~06시): +20%', '주말 할증: +10%'],
  },
  {
    id: '4',
    route: '서울 ↔ 경기',
    distance: '35km',
    time: '1시간 10분',
    basePrice: '42,000원',
    vehicleType: '일반',
    description: '서울과 경기도 주요 지역 간 이동',
    details: {
      baseFare: '30,000원',
      distanceFare: '7,000원',
      timeFare: '5,000원',
      total: '42,000원',
    },
    additionalInfo: ['야간 할증 (22시~06시): +20%', '고속도로 통행료 별도'],
  },
  {
    id: '5',
    route: '서울 시내 (단거리)',
    distance: '8km',
    time: '16분',
    basePrice: '12,000원',
    vehicleType: '일반',
    description: '서울 시내 단거리 이동',
    details: {
      baseFare: '8,000원',
      distanceFare: '2,000원',
      timeFare: '2,000원',
      total: '12,000원',
    },
    additionalInfo: ['야간 할증 (22시~06시): +20%'],
  },
  {
    id: '6',
    route: '서울 ↔ 부산',
    distance: '325km',
    time: '10시간 50분',
    basePrice: '280,000원',
    vehicleType: '대형',
    description: '서울에서 부산까지 장거리 이동',
    details: {
      baseFare: '200,000원',
      distanceFare: '50,000원',
      timeFare: '30,000원',
      total: '280,000원',
    },
    additionalInfo: [
      '야간 할증 (22시~06시): +20%',
      '장거리 할증: +30,000원',
      '고속도로 통행료 별도',
      '휴게시간 포함',
    ],
  },
  {
    id: '7',
    route: '서울 ↔ 대전',
    distance: '167km',
    time: '2시간 30분',
    basePrice: '150,000원',
    vehicleType: '중형',
    description: '서울에서 대전까지 중거리 이동',
    details: {
      baseFare: '100,000원',
      distanceFare: '30,000원',
      timeFare: '20,000원',
      total: '150,000원',
    },
    additionalInfo: ['야간 할증 (22시~06시): +20%', '고속도로 통행료 별도'],
  },
  {
    id: '8',
    route: '서울 ↔ 대구',
    distance: '300km',
    time: '4시간',
    basePrice: '250,000원',
    vehicleType: '대형',
    description: '서울에서 대구까지 장거리 이동',
    details: {
      baseFare: '180,000원',
      distanceFare: '45,000원',
      timeFare: '25,000원',
      total: '250,000원',
    },
    additionalInfo: [
      '야간 할증 (22시~06시): +20%',
      '장거리 할증: +30,000원',
      '고속도로 통행료 별도',
    ],
  },
  {
    id: '9',
    route: '서울 ↔ 광주',
    distance: '267km',
    time: '3시간 30분',
    basePrice: '220,000원',
    vehicleType: '대형',
    description: '서울에서 광주까지 장거리 이동',
    details: {
      baseFare: '160,000원',
      distanceFare: '40,000원',
      timeFare: '20,000원',
      total: '220,000원',
    },
    additionalInfo: [
      '야간 할증 (22시~06시): +20%',
      '장거리 할증: +30,000원',
      '고속도로 통행료 별도',
    ],
  },
  {
    id: '10',
    route: '서울 ↔ 수원',
    distance: '45km',
    time: '1시간 30분',
    basePrice: '52,000원',
    vehicleType: '일반',
    description: '서울에서 수원까지 이동',
    details: {
      baseFare: '35,000원',
      distanceFare: '10,000원',
      timeFare: '7,000원',
      total: '52,000원',
    },
    additionalInfo: ['야간 할증 (22시~06시): +20%', '고속도로 통행료 별도'],
  },
];

const vehicleTypeColor = {
  일반: 'bg-blue-600',
  중형: 'bg-green-600',
  대형: 'bg-purple-600',
};

export default function PriceDetailScreen() {
  const { id } = useLocalSearchParams();
  const price = mockPrices.find(item => item.id === id);
  const insets = useSafeAreaInsets();

  if (!price) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-lg text-gray-300">요금 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ padding: 16, paddingBottom: Math.max(insets.bottom, 60) }}
    >
      {/* 노선 정보 카드 */}
      <View className="mb-4 w-full rounded-2xl bg-neutral-900 p-6">
        <View className="mb-4 flex-row items-center justify-between">
          <View
            className={`rounded-md px-3 py-1 ${vehicleTypeColor[price.vehicleType] || 'bg-gray-600'}`}
          >
            <Text className="text-xs font-semibold text-white">{price.vehicleType}</Text>
          </View>
          <Text className="text-3xl font-bold text-white">{price.basePrice}</Text>
        </View>

        <Text className="mb-2 text-2xl font-bold text-white">{price.route}</Text>
        <Text className="mb-4 text-base text-gray-300">{price.description}</Text>

        <View className="flex-row gap-4">
          <Text className="text-lg text-gray-300">{price.distance}</Text>
          <Text className="text-lg text-gray-600">|</Text>
          <Text className="text-lg text-gray-300">{price.time}</Text>
        </View>
      </View>

      {/* 요금 상세 내역 */}
      <View className="mb-4 w-full rounded-2xl bg-neutral-900 p-6">
        <Text className="mb-4 text-xl font-bold text-white">요금 상세 내역</Text>

        <View className="mb-3 flex-row justify-between border-b border-gray-700 pb-3">
          <Text className="text-base text-gray-300">기본 요금</Text>
          <Text className="text-base font-semibold text-white">{price.details.baseFare}</Text>
        </View>

        <View className="mb-3 flex-row justify-between border-b border-gray-700 pb-3">
          <Text className="text-base text-gray-300">거리 요금</Text>
          <Text className="text-base font-semibold text-white">{price.details.distanceFare}</Text>
        </View>

        <View className="mb-3 flex-row justify-between border-b border-gray-700 pb-3">
          <Text className="text-base text-gray-300">시간 요금</Text>
          <Text className="text-base font-semibold text-white">{price.details.timeFare}</Text>
        </View>

        <View className="mt-4 flex-row justify-between">
          <Text className="text-xl font-bold text-white">총 요금</Text>
          <Text className="text-2xl font-bold text-white">{price.details.total}</Text>
        </View>
      </View>

      {/* 추가 정보 */}
      <View className="w-full rounded-2xl bg-neutral-900 p-6">
        <Text className="mb-4 text-xl font-bold text-white">추가 정보</Text>

        {price.additionalInfo.map((info, index) => (
          <View key={index} className="mb-2 flex-row items-start">
            <Text className="mr-2 text-purple-500">•</Text>
            <Text className="flex-1 text-base text-gray-300">{info}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
