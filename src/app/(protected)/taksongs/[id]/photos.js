import { View, Text, TouchableOpacity, Alert, Image, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { deepCopy, isFileUnder2MB } from '@/lib/utils';
import { getLocation } from '@/hooks/useLocation';
import { useRemovePhoto } from '@/hooks/useRemovePhoto';
import ImageThumbnail from '@/components/ImageThumbnail';
import { getCameraPermissions } from '@/lib/permissions';
import { TABS } from '@/data/codes'
import { useImageUriStore } from '@/store/useImageUriStore';

const tabs = deepCopy(TABS)
export default function CameraScreen() {
    const { id } = useLocalSearchParams()
    const { data: order } = useOrder(id)
    const { data: orderLocation, refetch: refetchOrderLocation } = useOrderLocationProcess(id)
    const {
        imageUri,
        type ,
        orderPhoto,
        setOrderPhoto,
        clearOrderPhoto
    } = useImageUriStore()

    const isMountedRef = useRef(false)

    const [isLoading, setIsLoading] = useState(false)
    const [isTakingPicture, setIsTakingPicture] = useState(false)
    const [ready, setReady] = React.useState(false)
    const [tab, setTab] = useState(tabs[0])
    const [photoList, setPhotoList] = useState([])

    const orderPhotoList = useMemo(() => {
        const list = photoList.filter(e => e.position === tab.key)
        return list.length > 0 ? list : [null]
    }, [photoList, tab.key])

    const { data: orderPhotos } = useOrderPhotoList(order?.uid, orderLocation?.uid, ready)

    const uploadMutation = useOrderPhotoUpload()
    const endMutation = useOrderLocationEnd()
    const updateOrderStatusMutation = useOrderStatusUpdate()
    const driverMoveMutation = useDriverMove()

    const onHandleTakePicture = async () => {
        if (isTakingPicture) return

        const status = await getCameraPermissions()
        if (status !== "granted") {
            alert("카메라 권한이 필요합니다!")
            return
        }

        setIsTakingPicture(true)
        try {
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
                    await onUploadPhoto(uri, tab.key, 'SUB')
                }
            }
        }
        finally {
            setIsTakingPicture(false)
        }
    }

    const onUploadPhoto = async (uri, position, subType) => {
        const file = await uriToFileObject(uri)
        const sendData = {
            orderUid: order.uid,
            orderLocationUid: orderLocation.uid,
            type: orderLocation.type,
            subType: subType,
            position: position,
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
            await fetch(orderPhoto.url, {
                method: "PUT",
                headers: {
                    'Content-Type': file.type,
                },
                body: file.blob
            })

            if (!isMountedRef.current) return
            if (subType === "MAIN") {
                setOrderPhoto(orderPhoto, position)
            }
            else if (subType === "SUB") {
                onSaveSubPhoto(orderPhoto)
            }
        }
        else {
            Alert.alert("알림", "이미지 등록에 실패 하였습니다. 네트워크 상태를 확인해 주세요.")
        }
    }

    const onSaveSubPhoto = (orderPhoto) => {
        setPhotoList(prev => {
            const exists = prev.some(p => p.uid === orderPhoto.uid)
            return exists
                ? prev
                : [...prev, orderPhoto]
        })

        if (orderPhotoList.length < tab.max) {
            setTimeout(onHandleTakePicture, 100)
        }
    }

    const { removePhoto } = useRemovePhoto({
        photoList: photoList[tab.key],
        setPhotoList: setPhotoList
    })

    const renderSlot = useCallback(({ item }) => (
        <ImageThumbnail
            key={item?.uid ?? "1"}
            item={item}
            onRemove={removePhoto}
        />
    ), [removePhoto])


    // 촬영 완료 핸들러
    const handleComplete = async () => {
        let isValid = true
        for (const _tab of tabs) {
            const list = photoList.filter(e => e.position === _tab.key)
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

    const onTakeMainImage = () => {
        router.push({
            pathname: `/(protected)/taksongs/${id}/cameraOutline`,
            params: {
                type: tab.key
            }
        })
    }

    useEffect(() => {
        isMountedRef.current = true

        return () => {
            isMountedRef.current = false
            clearOrderPhoto()
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

        if (orderPhotos && Array.isArray(orderPhotos) && orderPhotos.length > 0) {
            setPhotoList(orderPhotos)
        }
    }, [orderPhotos])

    useEffect(() => {
        if (imageUri && type) {

        }
    }, [imageUri, type])

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
                <TouchableOpacity
                    className={"justify-center items-center"}
                    onPress={onTakeMainImage}
                    disabled={isTakingPicture}
                >
                    { isTakingPicture
                        ? (<ActivityIndicator color={"fff"} /> )
                        : (<Image source={require('@assets/icon/ic_photo.png')} className="mb-8 h-28 w-28" />)
                    }
                </TouchableOpacity>
                <Text className={"color-white absolute top-4"}>{tab.name} 사진을 촬영해 주세요.</Text>
            </View>

            <View className={"flex-col justify-center items-center mt-8"}>
                <Text className={"color-white text-sm mb-1"}>{tab.min}장 이상 {tab.max}장 이하로 사진을 촬영해 주세요.</Text>
                <Text className={"color-white text-sm mb-1"}>스크래치 및 찌그러짐이 있는 부분 위주로 사진을 찍어 주세요.</Text>
                <Text className={"color-white text-sm"}>({tab.imageText})</Text>
            </View>

            <FlatList
                data={orderPhotoList}
                renderItem={renderSlot}
                keyExtractor={(item, index) => `${item?.uid}_${index.toString()}`}
                numColumns={3}
                className={"px-5 mt-5"}
            />

            {/* Bottom Button */}
            <TouchableOpacity
                className={`mt-4 mx-5 rounded-xl py-4 mb-16 items-center
                    ${ isLoading ? "bg-gray-400" : 'bg-primary'}
                `}
                onPress={handleComplete}
                disabled={isLoading || isTakingPicture}
            >
                {isLoading || isTakingPicture
                    ? (<ActivityIndicator color="#fff" />)
                    : (
                        <Text className="color-white text-base font-semibold">
                            촬영 완료
                        </Text>
                    )}
            </TouchableOpacity>
        </View>
    )
}
