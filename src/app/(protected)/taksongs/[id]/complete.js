import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useOrder, useOrderStatusUpdate } from '@/hooks/useApi';
import { useCallback } from 'react';


export default function CompleteScreen() {
    const { id } = useLocalSearchParams()
    const insets = useSafeAreaInsets()
    const { data } = useOrder(id)

    const onHandleComplete = async () => {
        router.replace(`/(protected)/taksongs`)
    }

    return (
        <View className={"flex-1 bg-black"}>
            <View className={"flex-1 p-4"}>
                <View className={"flex-1 p-4"}>
                    <View className={""}>
                        <View className={""}>탁송 금액</View>
                        <View className={""}>40000원</View>
                    </View>
                </View>
                <View className={""}>
                    <View>청구 금액</View>
                    <View>20000원</View>
                </View>
            </View>
            <View
                className={"p-4"}
                style={{ paddingBottom: Math.max(insets.bottom, 60) }}
            >
                <View>
                    <Pressable onPress={onHandleComplete} className="w-full rounded-xl bg-btn py-4">
                        <Text className="text-center text-xl font-semibold text-white">탁송 완료</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}