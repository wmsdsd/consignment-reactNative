import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {useDriverMove, useOrder, useOrderStatusUpdate} from '@/hooks/useApi';
import {useMemo} from 'react';
import {addCommaToNumber} from "@/lib/utils";
import {getLocation} from "@/hooks/useLocation";
import useGlobalLoading from '@/hooks/useGlobalLoading';
import { stopBackgroundLocation } from '@/lib/backgroundLocation';

export default function CompleteScreen() {
    const { id } = useLocalSearchParams()
    const insets = useSafeAreaInsets()

    const { data: order } = useOrder(id)

    const isLoading = useGlobalLoading({
        mutating: { mutationKey: ['order', 'driverMove'] }
    })

    const updateOrderStatusMutation = useOrderStatusUpdate()
    const driverMoveMutation = useDriverMove()

    const settlementPrice = useMemo(() => {
        if (order && Array.isArray(order?.orderSettlements)) {
            const list = order.orderSettlements.filter(e => e.category === "ADD")
            return list.reduce((acc, cur) => {
                const price = cur.price
                return acc + price
            }, 0)
        }
        else {
            return 0
        }
    }, [order?.orderSettlements])

    const onHandleComplete = async () => {
        await stopBackgroundLocation()

        if (order?.status === "DRIVER_END") {
            const res = await updateOrderStatusMutation.mutateAsync({
                orderId: order.uid,
                status: "DELIVERY_COMPLETE"
            })
            if (res) {
                const coords = await getLocation()
                if (coords) {
                    const orderLocation = order?.orderLocations?.find(e => e.type === "END")
                    await driverMoveMutation.mutateAsync({
                        name: `탁송 완료`,
                        type: "HISTORY",
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        orderUid: id,
                        orderLocationUid: orderLocation?.uid,
                    })
                }

                moveToList()
            }
        }
        else {
            moveToList()
        }
    }

    const moveToList = () => {
        router.replace(`/(protected)/taksongs`)
    }

    return (
        <View className={"flex-1 bg-black"}>
            <View className={"flex-1 p-2"}>
                <View className={"flex-1 p-4"}>
                    <View className={"border border-color rounded-lg flex justify-center items-center p-8"}>
                        <View className={""}>
                            <Text className={"font-color-sub font-bold text-xl mb-5"}>탁송 금액</Text>
                        </View>
                        <View className={""}>
                            <Text className={"font-color font-semibold text-6xl"}>{addCommaToNumber(order?.driverPrice)}원</Text>
                        </View>
                    </View>
                </View>
                <View className={"flex justify-center items-center"}>
                    <View>
                        <Text className={"font-color-label text-xl mb-2.5"}>청구 금액</Text>
                    </View>
                    <View>
                        <Text className={"font-color text-4xl font-semibold"}>{addCommaToNumber(settlementPrice)}원</Text>
                    </View>
                </View>
            </View>
            <View
                className={"p-4"}
                style={{ paddingBottom: Math.max(insets.bottom, 60) }}
            >
                <View>
                    <Pressable
                        onPress={onHandleComplete}
                        className={`w-full rounded-xl py-4 ${isLoading ? 'bg-gray-400' : 'bg-btn'}`}
                        disabled={isLoading}
                    >
                        <Text className="text-center text-xl font-semibold text-white">
                            { isLoading ? "데이터 전송 중" : "탁송 완료" }
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}