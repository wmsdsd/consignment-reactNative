import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';

export default function CameraScreen() {
  const { id } = useLocalSearchParams();
  const [capturedImages, setCapturedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 촬영 완료 핸들러
  const handleComplete = async () => {
    if (capturedImages.length === 0) {
      Alert.alert('알림', '최소 한 장 이상의 사진을 촬영해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 사진 업로드 및 촬영 완료 API 호출
      Alert.alert('완료', '촬영이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            router.replace(`/(protected)/taksongs/${id}`);
          },
        },
      ]);
    } catch (error) {
      console.error('촬영 완료 중 오류:', error);
      Alert.alert('오류', '촬영 완료 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 카메라 촬영 핸들러 (플레이스홀더)
  const handleTakePhoto = () => {
    // TODO: 실제 카메라 기능 구현
    // 여기서는 예시로 더미 이미지를 추가합니다
    Alert.alert('촬영', '카메라 기능을 구현하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '예시 촬영',
        onPress: () => {
          // 더미 이미지 추가
          setCapturedImages(prev => [
            ...prev,
            { id: Date.now(), uri: null }, // 실제로는 촬영한 이미지 URI
          ]);
          Alert.alert('완료', '사진이 촬영되었습니다. (예시)');
        },
      },
    ]);
  };

  // 촬영한 사진 삭제
  const handleDeleteImage = imageId => {
    Alert.alert('삭제', '이 사진을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          setCapturedImages(prev => prev.filter(img => img.id !== imageId));
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* 카메라 프리뷰 영역 */}
      <View className="flex-1 items-center justify-center bg-black">
        {/* 실제 카메라는 여기에 구현됩니다 */}
        <View className="h-full w-full items-center justify-center bg-gray-800">
          <Text className="mb-4 text-lg font-semibold text-white">📷 카메라 화면</Text>
          <Text className="mb-8 text-sm text-gray-400">카메라 기능을 구현해주세요</Text>

          {/* 촬영된 사진 미리보기 */}
          {capturedImages.length > 0 && (
            <View className="mb-4 w-full px-4">
              <Text className="mb-2 text-sm font-medium text-white">
                촬영된 사진 ({capturedImages.length}장)
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {capturedImages.map(image => (
                  <View key={image.id} className="relative">
                    <View className="h-20 w-20 rounded-lg bg-gray-700" />
                    <TouchableOpacity
                      onPress={() => handleDeleteImage(image.id)}
                      className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500"
                    >
                      <Text className="text-xs text-white">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 촬영 버튼 */}
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="mb-8 h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white"
          >
            <View className="h-12 w-12 rounded-full bg-gray-800" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 컨트롤 영역 */}
      <View className="border-t border-gray-700 bg-gray-800 px-4 py-4 pb-12">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm text-gray-300">촬영된 사진: {capturedImages.length}장</Text>
          <Text className="text-xs text-gray-400">최소 1장 이상 촬영해주세요</Text>
        </View>
        <TouchableOpacity
          onPress={handleComplete}
          disabled={isLoading || capturedImages.length === 0}
          className={`rounded-lg p-4 ${
            isLoading || capturedImages.length === 0 ? 'bg-gray-600' : 'bg-green-500'
          }`}
        >
          <Text className="text-center text-xl font-semibold text-white">
            {isLoading ? '처리 중...' : '촬영 완료'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
