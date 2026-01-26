import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    FlatList,
    ToastAndroid,
    ActivityIndicator,
    Image
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    useDriverMove,
    useOrder,
    useOrderLocationEnd,
    useOrderLocationProcess,
    useOrderPhotoList,
    useOrderStatusUpdate,
} from '@/hooks/useApi'

import { deepCopy } from '@/lib/utils'
import { getLocation } from '@/hooks/useLocation'
import { useRemovePhoto } from '@/hooks/useRemovePhoto'
import ImageThumbnail from '@/components/ImageThumbnail'
import { TABS } from '@/data/codes'

const tabs = deepCopy(TABS)
export default function CameraScreen() {
    const { id, type } = useLocalSearchParams()
    const { data: order } = useOrder(id)
    const { data: orderLocation, refetch: refetchOrderLocation } = useOrderLocationProcess(id)

    const isMountedRef = useRef(false)

    const [isLoading, setIsLoading] = useState(false)
    const [ready, setReady] = useState(false)
    const [tab, setTab] = useState(tabs[0])
    const [photoList, setPhotoList] = useState([])

    const orderPhotoList = useMemo(() => {
        const list = photoList.filter(e => e.position === tab.position)
        return list.length > 0 ? [...list] : []
    }, [photoList, tab.position])

    const { data: orderPhotos, refetch: refetchOrderPhotos } = useOrderPhotoList(order?.uid, orderLocation?.uid, ready)

    const endMutation = useOrderLocationEnd()
    const updateOrderStatusMutation = useOrderStatusUpdate()
    const driverMoveMutation = useDriverMove()

    const { removePhoto } = useRemovePhoto()

    const reTakePhotos = () => {
        const isMax = orderPhotoList.length >= tab.max
        if (isMax) {
            Alert.alert("알림", `${tab.name} 이미지는 ${tab.max}장 이하로 촬영이 가능합니다.`)
        }
        else {
            router.replace({
                pathname: `/(protected)/taksongs/${id}/takePhotos`,
                params: {
                    position: tab.position,
                    count: orderPhotoList.length
                }
            })
        }
    }

    const renderSlot = useCallback(({ item }) => (
        <ImageThumbnail
            key={item?.uid ?? "1"}
            item={item}
            onRemove={removePhoto}
            onPressEmpty={reTakePhotos}
        />
    ), [removePhoto, reTakePhotos])

    // 촬영 완료 핸들러
    const handleComplete = async () => {
        let isValid = true
        for (const t of tabs) {
            const list = photoList.filter(e => e.position === t.position)
            const length = list.length
            if (length < t.min || length > t.max) {
                Alert.alert("알림", `${t.name} 이미지를 ${t.min}장 이상 ${t.max}장 이하로 촬영해 주세요.`)
                isValid = false
                return
            }
        }

        if (!isValid) return

        Alert.alert(
            '사진 촬영 완료',
            '사진 촬영을 완료 하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '확인',
                    style: 'destructive',
                    onPress: async () => {
                        await handleEndOrderLocation()
                    },
                },
            ]
        )
    }

    const handleEndOrderLocation = async () => {
        setIsLoading(true)
        try {
            const res = await endMutation.mutateAsync({
                orderUid: order.uid,
                orderLocationUid: orderLocation.uid
            })
            if (res) {
                await moveToNextProcess()
            }
        }
        catch (e) {
            console.log("handleEndOrderLocation Error:", e)
            ToastAndroid.show("프로세스 처리중 문제가 발생했습니다. 통신 상태를 확인 후 다시 시도해주세요.", ToastAndroid.SHORT)
        }
        finally {
            setIsLoading(false)
        }
    }

    const moveToNextProcess = async () => {
        const { data } = await refetchOrderLocation()
        if (data) {
            const coords = await getLocation()
            if (coords) {
                await driverMoveMutation.mutateAsync({
                    name: `[${orderLocation.typeName}] 탁송 기사 도착`,
                    type: "HISTORY",
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    orderUid: id,
                    orderLocationUid: orderLocation.uid,
                })
            }

            router.replace(`/(protected)/taksongs/${id}/detail`)
        }
        else {
            const res = await updateOrderStatusMutation.mutateAsync({
                orderId: order.uid,
                status: "DELIVERY_COMPLETE"
            })
            if (res) {
                const coords = await getLocation()
                if (coords) {
                    await driverMoveMutation.mutateAsync({
                        name: `탁송 완료`,
                        type: "HISTORY",
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        orderUid: id,
                        orderLocationUid: orderLocation.uid,
                    })
                }

                router.replace(`/(protected)/taksongs/${id}/complete`)
            }
        }
    }

    useEffect(() => {
        isMountedRef.current = true

        return () => {
            isMountedRef.current = false
        }
    }, [])

    useEffect(() => {
        if (!isMountedRef.current) return

        setReady(!!order?.uid && !!orderLocation?.uid)
        setTab(tabs[0])
        setPhotoList([])
    }, [])

    useEffect(() => {
        if (!isMountedRef.current) return

        ;(async () => {
            if (type === 'reTake') {
                await refetchOrderPhotos()
            }

            if (orderPhotos && Array.isArray(orderPhotos) && orderPhotos.length > 0) {
                setPhotoList(orderPhotos)
            }
        })()
    }, [orderPhotos])

    return (
        <View className={"bg-black flex-1"}>
            {/* Tabs */}
            <View className={'flex-row justify-around pb-2.5 mt-4'}>
                {tabs.map((t, index) => (
                    <TouchableOpacity
                        key={`${tab.key}-${index}`}
                        onPress={() => setTab(t)}
                        className={`py-1 ${tab.position === t.position ? "border-b-2 border-white" : ""}`}
                    >
                        <Text className={`color-[#777] text-sm ${tab.position === t.position ? "color-white font-bold" : ""}`}>
                            {t.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View className={"flex-col justify-center items-center mt-2"}>
                <Text className={"color-white text-sm mb-1"}>{tab.min}장 이상 {tab.max}장 이하로 사진을 촬영해 주세요.</Text>
                <Text className={"color-white text-sm mb-1"}>스크래치 및 찌그러짐이 있는 부분 위주로 사진을 찍어 주세요.</Text>
                <Text className={"color-white text-sm"}>({tab.imageText})</Text>
            </View>

            <View className={"flex-1"}>
                <FlatList
                    data={orderPhotoList}
                    keyExtractor={(item, index) => `${item?.uid}_${index.toString()}`}
                    renderItem={renderSlot}
                    windowSize={5}
                    maxToRenderPerBatch={5}
                    initialNumToRender={5}
                    numColumns={3}
                    className={"p-5 mt-4"}
                    contentContainerStyle={{
                        alignItems: 'center',
                    }}
                    columnWrapperStyle={{
                        justifyContent: 'center',
                    }}
                />
            </View>
            <View>
                <TouchableOpacity
                    className="flex flex-row rounded-xl py-4 items-center justify-center bg-secondary gap-2 mt-4"
                    style={{ marginHorizontal: 60 }}
                    onPress={reTakePhotos}
                >
                    <Image source={require("assets/icon/ic_camera_primary.png")} resizeMode={"cover"} />
                    <Text className="font-color-primary text-base font-bold">추가 촬영</Text>
                </TouchableOpacity>

                {/* Bottom Button */}
                <TouchableOpacity
                    className={`mt-4 mx-5 rounded-xl py-4 mb-16 items-center
                    ${ isLoading ? "bg-gray-400" : 'bg-primary'}
                `}
                    onPress={handleComplete}
                    disabled={isLoading}
                >
                    {isLoading
                        ? (<ActivityIndicator color="#fff" />)
                        : (
                            <Text className="color-white text-base font-semibold">
                                촬영 완료
                            </Text>
                        )}
                </TouchableOpacity>
            </View>
        </View>
    )
}
