import { View, Text, TouchableOpacity, Alert, Image, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react';
import {
    useDriverMove,
    useOrder,
    useOrderLocationEnd,
    useOrderLocationProcess,
    useOrderPhotoList,
    useOrderPhotoUpload,
    useOrderStatusUpdate,
} from '@/hooks/useApi';
import * as ImagePicker from 'expo-image-picker'
import { uriToFileObject } from "@/lib/uriToFile"
import {isAndroid} from "@/lib/platform"
import { isFileUnder2MB } from '@/lib/utils';
import { getLocation } from '@/hooks/useLocation';
import { useRemovePhoto } from '@/hooks/useRemovePhoto';
import ImageThumbnail from '@/components/ImageThumbnail';
import useGlobalLoading from "@/hooks/useGlobalLoading";

const tabs = [
    {
        name: "정면",
        key: "FRONT",
        min: 3,
        max: 5,
        sampleImage: require('@assets/images/sample/car_front.png')
    },
    {
        name: "좌측",
        key: "LEFT",
        min: 2,
        max: 5,
        sampleImage: require('@assets/images/sample/car_left.png')
    },
    {
        name: "후면",
        key: "BACK",
        min: 3,
        max: 5,
        sampleImage: require('@assets/images/sample/car_back.png')
    },
    {
        name: "우측",
        key: "RIGHT",
        min: 2,
        max: 5,
        sampleImage: require('@assets/images/sample/car_right.png')
    },
    {
        name: "내부 및 계기판",
        key: "INSIDE",
        min: 3,
        max: 10,
        sampleImage: require('@assets/images/sample/car_inside.png')
    },
    // {
    //     name: "하부",
    //     key: "BOTTOM",
    //     selected: false,
    //     min: 2,
    //     max: 5
    // },
]

export default function CameraScreen() {
    const { id } = useLocalSearchParams()
    const { data: order } = useOrder(id)
    const { data: orderLocation, refetch: refetchOrderLocation } = useOrderLocationProcess(id)
    const isLoading = useGlobalLoading()

    const [ready, setReady] = React.useState(false)
    const [tab, setTab] = useState(tabs[0])
    const [photoList, setPhotoList] = useState({
        FRONT: [null],
        LEFT: [null],
        BACK: [null],
        RIGHT: [null],
        INSIDE: [null],
    })

    const { data: orderPhotos } = useOrderPhotoList(order?.uid, orderLocation?.uid, ready)

    const uploadMutation = useOrderPhotoUpload()
    const endMutation = useOrderLocationEnd()
    const updateOrderStatusMutation = useOrderStatusUpdate()
    const driverMoveMutation = useDriverMove()

    const onHandleTakePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== "granted") {
            alert("카메라 권한이 필요합니다!")
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 0.8,
        })

        if (!result.canceled) {
            const uri = result.assets[0].uri
            const isUnder = await isFileUnder2MB(uri)

            if (!isUnder) {
                Alert.alert("알림", "파일 크기는 5MB 이하만 가능합니다.")
                await onHandleTakePicture()
            }
            else {
                const file = await uriToFileObject(uri)
                const sendData = {
                    orderUid: order.uid,
                    orderLocationUid: orderLocation.uid,
                    type: orderLocation.type,
                    position: tab.key,
                    fileList: [
                        {
                            fileName: file.name,
                            fileType: file.type
                        }
                    ]
                }

                const list = await uploadMutation.mutateAsync(sendData)
                if (Array.isArray(list) && list.length > 0) {
                    const orderPhoto = list[0]
                    const uploadS3 = await fetch(orderPhoto.url, {
                        method: "PUT",
                        headers: {
                            'Content-Type': file.type,
                        },
                        body: file.blob
                    })

                    const list = photoList[tab.key].filter(e => e !== null)
                    setPhotoList({
                        ...photoList,
                        [tab.key]: [orderPhoto, ...list],
                    })

                    if (photoList[tab.key].length < tab.max) {
                        await onHandleTakePicture()
                    }
                }
                else {
                    Alert.alert("알림", "이미지 등록에 실패 하였습니다. 네트워크 상태를 확인해 주세요.")
                }
            }
        }
    }

    const updatePhotoList = (list) => {
        setPhotoList({
            ...photoList,
            [tab.key]: list,
        })
    }

    const { removePhoto } = useRemovePhoto({
        photoList: photoList[tab.key],
        setPhotoList: updatePhotoList
    })

    const renderSlot = useCallback(({ item }) => (
        <ImageThumbnail item={item} onRemove={removePhoto} />
    ), [removePhoto])


    // 촬영 완료 핸들러
    const handleComplete = async () => {
        let isValid = true
        for (const _tab of tabs) {
            const list = photoList[_tab.key]
            const length = list.length
            if (length < _tab.min || length > _tab.max) {
                Alert.alert("알림", `${_tab.name} 이미지를 ${_tab.min}장 이상 ${_tab.max}장 이하로 촬영해 주세요.`)
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
        const res = await endMutation.mutateAsync({
            orderUid: order.uid,
            orderLocationUid: orderLocation.uid
        })
        if (res) {
            await moveToNextProcess()
        }
    }

    const moveToNextProcess = async () => {
        const { data } = await refetchOrderLocation()
        console.log("refresh orderLocation", data)

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

            router.replace(`/(protected)/taksongs/${id}/confirm`)
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
        setReady(!!order?.uid && !!orderLocation?.uid)
        setTab(tabs[0])
        setPhotoList({
            FRONT: [null],
            LEFT: [null],
            BACK: [null],
            RIGHT: [null],
            INSIDE: [null],
        })

    }, [])

    useEffect(() => {
        if (orderPhotos && Array.isArray(orderPhotos) && orderPhotos.length > 0) {
            for (const orderPhoto of orderPhotos) {
                if (orderPhoto.position) {
                    const list = photoList[orderPhoto.position]
                    if (list.find(e => e?.uid === orderPhoto.uid)) break

                    const removeNullList = list.filter(e => e !== null)
                    setPhotoList({
                        ...photoList,
                        [orderPhoto.position]: [orderPhoto, ...removeNullList],
                    })
                }
            }
        }
    }, [orderPhotos])

    return (
        <View className={"bg-black flex-1"}>
            {/* Tabs */}
            <View className={'flex-row justify-around pb-2.5 mt-4'}>
                {tabs.map((t, index) => (
                    <TouchableOpacity
                        key={`${tab.key}-${index}`}
                        onPress={() => setTab(t)}
                        className={`py-1 ${tab.key === t.key ? "border-b-2 border-white" : ""}`}
                    >
                        <Text className={`color-[#777] text-sm ${tab.key === t.key ? "color-white font-bold" : ""}`}>
                            {t.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Big Camera Area */}
            <View className={"h-[260px] mx-5 mt-4 rounded-xl bg-[#222] justify-center items-center relative"}>
                <Image source={tab.sampleImage} className={"absolute opacity-60"} />
                <TouchableOpacity className={"justify-center items-center"} onPress={onHandleTakePicture}>
                    <Image
                        source={require('@assets/icon/ic_photo.png')}
                        className="mb-8 h-28 w-28"
                    />
                </TouchableOpacity>
                <Text className={"color-white absolute bottom-4"}>{tab.min}장 이상 {tab.max}장 이하로 사진을 촬영해 주세요.</Text>
            </View>

            {/* Grid 3×3 */}
            <FlatList
                data={photoList[tab.key]}
                renderItem={renderSlot}
                keyExtractor={(_, index) => index.toString()}
                numColumns={3}
                className={"px-5 mt-5"}
            />

            {/* Bottom Button */}
            <TouchableOpacity
                className={`mt-4 mx-5 bg-primary rounded-xl py-4 mb-16 items-center
                    ${ isLoading && "bg-gray-400"}
                `}
                onPress={handleEndOrderLocation}
                disabled={isLoading}
            >
                {
                    isLoading
                        ? (<ActivityIndicator color="#fff" />)
                        : (
                            <Text className="color-white text-base font-semibold">
                                촬영 완료
                            </Text>
                        )
                }
            </TouchableOpacity>
        </View>
    )
}
