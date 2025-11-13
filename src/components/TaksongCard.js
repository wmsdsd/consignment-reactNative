import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const statusColor = {
  '예약 완료': 'bg-blue-600',
  '예약 취소': 'bg-red-500',
  '기사 배정': 'bg-green-600',
  '예약 대기': 'bg-yellow-500',
  '픽업 중': 'bg-purple-600',
};

export default function TaksongCard({
  id,
  status = '예약 완료',
  price = '990,000원',
  carNumber = null,
  distance = '238km',
  duration = '2시간 30분',
  start = '경기도 평택시 경기대로',
  end = '경기도 하남시 미사대로',
}) {
  const handlePress = () => {
    if (id) {
      router.push(`/(protected)/taksongs/${id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="mb-4 w-full rounded-xl bg-[#1E1E1E] p-4"
    >
      {/* 상단 Row */}
      <View className="mb-2 flex-row items-center justify-between">
        <View className={`rounded-md px-3 py-1 ${statusColor[status] || 'bg-gray-600'}`}>
          <Text className="text-xs font-semibold text-white">{status}</Text>
        </View>

        <Text className="text-xl font-bold text-white">{price}</Text>
      </View>

      {/* 차량 번호 + 거리/시간 */}
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-white">
          {carNumber ? `🚗 ${carNumber}` : '차량 배정 대기'}
        </Text>

        <Text className="text-sm text-gray-300">
          {distance} | {duration}
        </Text>
      </View>

      {/* 출발 */}
      <View className="mb-1 flex-row">
        <Text className="w-10 text-gray-400">출발</Text>
        <Text className="flex-1 text-white">{start}</Text>
      </View>

      {/* 도착 */}
      <View className="flex-row">
        <Text className="w-10 text-gray-400">도착</Text>
        <Text className="flex-1 text-white">{end}</Text>
      </View>
    </TouchableOpacity>
  );
}
