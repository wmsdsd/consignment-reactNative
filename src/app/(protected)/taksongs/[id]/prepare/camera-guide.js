import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function CameraGuideScreen() {
  const { id } = useLocalSearchParams();

  // 촬영 시작 핸들러 - 촬영 페이지로 이동
  const handleStartCamera = () => {
    router.push(`/(protected)/taksongs/${id}/prepare/camera`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* 촬영 안내 헤더 */}
        <View className="mx-4 mt-6 rounded-xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
          <View className="mb-2 items-center">
            <Text className="text-2xl font-bold text-purple-700">📸 촬영 안내</Text>
            <Text className="mt-2 text-center text-sm text-gray-600">
              아래 사진 촬영 가이드를 확인해주세요
            </Text>
          </View>
        </View>

        {/* 촬영 가이드 */}
        <View className="mx-4 my-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Text className="mb-4 text-lg font-bold text-gray-900">촬영 가이드</Text>

          {/* 가이드 항목들 */}
          <View className="space-y-4">
            {/* 항목 1 */}
            <View className="flex-row items-start">
              <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-base font-bold text-blue-700">1</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-gray-900">차량 번호판 확인</Text>
                <Text className="text-sm leading-5 text-gray-600">
                  차량 번호판이 명확하게 보이도록 촬영해주세요. 번호판 전체가 프레임에 들어와야
                  합니다.
                </Text>
              </View>
            </View>

            {/* 항목 2 */}
            <View className="flex-row items-start">
              <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-base font-bold text-blue-700">2</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-gray-900">차량 전체 촬영</Text>
                <Text className="text-sm leading-5 text-gray-600">
                  차량 전체가 프레임에 들어오도록 촬영해주세요. 앞면, 뒷면을 각각 촬영하는 것을
                  권장합니다.
                </Text>
              </View>
            </View>

            {/* 항목 3 */}
            <View className="flex-row items-start">
              <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-base font-bold text-blue-700">3</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-gray-900">주변 환경 확인</Text>
                <Text className="text-sm leading-5 text-gray-600">
                  촬영 전 주변 환경을 확인해주세요. 충분한 조명이 있는지 확인하고, 다른 차량이나
                  장애물이 없는지 확인해주세요.
                </Text>
              </View>
            </View>

            {/* 항목 4 */}
            <View className="flex-row items-start">
              <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-base font-bold text-blue-700">4</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-gray-900">사진 품질 확인</Text>
                <Text className="text-sm leading-5 text-gray-600">
                  촬영 후 사진이 선명하게 나왔는지 확인해주세요. 번호판이 흐리거나 잘 보이지 않으면
                  다시 촬영해주세요.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 주의사항 */}
        <View className="mx-4 mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <Text className="mb-2 text-sm font-semibold text-yellow-800">⚠️ 주의사항</Text>
          <Text className="text-sm text-yellow-800">
            • 촬영 시 카메라가 흔들리지 않도록 주의해주세요{'\n'}• 번호판이 반사되어 보이지 않으면
            각도를 조절해주세요{'\n'}• 여러 각도에서 촬영하는 것을 권장합니다
          </Text>
        </View>

        {/* 예시 이미지 영역 (플레이스홀더) */}
        <View className="mx-4 mb-6 rounded-lg border border-gray-200 bg-gray-100 p-6">
          <Text className="mb-2 text-center text-sm font-medium text-gray-600">📷 촬영 예시</Text>
          <View className="h-48 items-center justify-center rounded-lg bg-gray-200">
            <Text className="text-gray-500">차량 사진 예시</Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View className="border-t border-gray-200 bg-white px-4 py-4 pb-12">
        <TouchableOpacity onPress={handleStartCamera} className="rounded-lg bg-purple-500 p-4">
          <Text className="text-center text-xl font-semibold text-white">촬영 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
