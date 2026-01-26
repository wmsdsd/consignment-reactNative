import { CameraView, useCameraPermissions } from 'expo-camera'
import { View, TouchableOpacity, Text, Alert, ActivityIndicator, Image, Dimensions } from 'react-native'
import { useEffect, useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router'
import { useOrder, useOrderLocationProcess } from '@/hooks/useApi'
import { uriToFileObject } from '@/lib/uriToFile'
import { enqueueUpload } from '@/lib/uploadImageQueue'
import { IMAGE_LAYOUTS, TABS } from '@/data/codes'

export default function TakePhotosScreen() {
    const { id, position, count } = useLocalSearchParams()
    const { data: orderLocation } = useOrderLocationProcess(id)
    const { width } = Dimensions.get("window")
    const [permission, requestPermission] = useCameraPermissions()

    const cameraRef = useRef(null)

    const [isLoading, setIsLoading] = useState(false)
    const [isExtra, setIsExtra] = useState(false)
    const [photoUri, setPhotoUri] = useState(null)
    const [imageIndex, setImageIndex] = useState(0)
    const [photoCount, setPhotoCount] = useState(0)

    const imageLayouts = useMemo(() => {
        return isExtra ? TABS : IMAGE_LAYOUTS
    }, [isExtra])
    const selectedImageLayout = useMemo(() => {
        if (imageLayouts.length === 0) return null

        const length = imageLayouts.length
        const safeIndex = ((imageIndex % length) + length) % length

        return imageLayouts[safeIndex]
    }, [imageIndex, imageLayouts])

    useEffect(() => {
        console.log("take photo position", position)
        const positionList = ['FRONT', 'RIGHT', 'BACK', 'LEFT', 'INSIDE']
        if (position && positionList.includes(position)) {
            setIsExtra(true)

            const index = positionList.indexOf(position)
            setImageIndex(index)
        }

        return () => {
            setIsExtra(false)
        }
    }, [position])

    useEffect(() => {
        const num = parseInt(String(count))
        if (count && !isNaN(num)) {
            setPhotoCount(num)
        }
    }, [count])

    if (!permission) return <View />
    if (!permission.granted) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>카메라 권한이 없습니다.</Text>
                <TouchableOpacity onPress={requestPermission}>
                    <Text style={{ marginTop: 10 }}>권한 요청하기</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const takePicture = async () => {
        if (!cameraRef.current || isLoading) return

        console.log("isExtra",isExtra)
        console.log("photoCount", photoCount)
        console.log("selectedImageLayout?.max", selectedImageLayout?.max)

        if (isExtra) {
            if (photoCount >= selectedImageLayout?.max) {
                Alert.alert("알림", `${selectedImageLayout.name} 이미지는 ${selectedImageLayout.max}장 이하로 촬영이 가능합니다.`)
                return
            }
        }
        
        try {
            setIsLoading(true)

            const result = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                skipProcessing: true
            })

            if (!result || !result.uri) return

            const uri = result.uri
            setPhotoUri(uri)

            let sendPosition = selectedImageLayout?.position ?? "ETC"
            let sendSubType = selectedImageLayout?.subType ?? "ETC"
            if (isExtra) {
                sendPosition = position
                sendSubType = "ETC"
            }

            const file = await uriToFileObject(uri)
            const promise = enqueueUpload({
                id: String(Date.now()),
                uri: uri,
                mimeType: file.type,
                file: file,
                extra: {
                    type: orderLocation.type,
                    position: sendPosition,
                    subType: sendSubType,
                    fileList: [
                        {
                            fileName: file.name,
                            fileType: file.type
                        }
                    ],
                    orderUid: orderLocation.orderUid,
                    orderLocationUid: orderLocation.uid,
                }
            })

            if (isExtra) {
                setPhotoCount(prev => prev + 1)
            }
            else {
                setImageIndex(prev => prev + 1)
                promise
                    .then(res => {
                        if (res) {
                            if (imageIndex >= imageLayouts.length - 1) {
                                onSuccess()
                            }
                        }
                    })
            }
        }
        catch (e) {
            console.warn("takePhoto error:", e)
        }
        finally {
            setIsLoading(false)
        }
    }

    const onSuccess = () => {
        if (isExtra) {
            router.replace({
                pathname: `/(protected)/taksongs/${id}/photos`,
                params: {
                    type: 'reTake'
                }
            })
        }
        else {
            router.push({
                pathname: `/(protected)/taksongs/${id}/photos`
            })
        }
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#000'
            }}
        >
            {/* ----- 카메라 화면 ----- */}
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="back"
            />

            {/* ----- 커스텀 촬영 버튼 UI ----- */}
            <View
                className={"flex-row"}
                style={{
                    position: 'absolute',
                    bottom: 40,
                    alignSelf: 'center',
                }}
            >
                {/* 촬영 버튼 */}
                <TouchableOpacity
                    onPress={takePicture}
                    className={`mb-8 h-20 w-20 items-center justify-center rounded-full 
                        ${ isLoading ? "bg-gray-400" : 'bg-primary'}
                    `}
                    disabled={isLoading}
                >
                    { isLoading
                        ? (<ActivityIndicator color={"fff"} />)
                        : (<Image source={require('assets/icon/ic_camera_small.png')} />)
                    }
                </TouchableOpacity>
            </View>

            {/* ----- 차량 가이드 영역 ----- */}
            <View
                style={{
                    position: 'absolute',
                    width: width - 40,
                    height: 100,
                    backgroundColor: '#000',
                    borderWidth: 1,
                    borderColor: '#FFF56C',
                    top: 15,
                    left: 20,
                    borderRadius: 10,
                }}
                className={"flex-row p-4"}
            >
                <View className={"mr-4"}>
                    <Image source={selectedImageLayout.thumbnail} className={"w-32 h-20 rounded-lg"} resizeMode={"cover"} />
                </View>
                <View>
                    <Text className={"text-white font-bold text-xl"}>{selectedImageLayout.name} {selectedImageLayout.label}</Text>
                    <Text className={"font-color-price flex-1 flex-wrap text-base flex-shrink"}>
                        해당 이미지의 촬영 구도와 {"\n"}
                        맞추어서 촬영해 주세요.
                    </Text>
                </View>
            </View>

            {/* ----- 이전에 촬영한 사진 ----- */}
            {!!photoUri && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 80,
                        left: 20,
                        borderRadius: 10,
                    }}
                    className={""}
                >
                    <Image source={{uri: photoUri}} className={"w-20 h-32 rounded-lg"} resizeMode={"cover"} />
                </View>
            )}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 45,
                    right: 40,
                }}
                onPress={onSuccess}
                className={`mb-8 ml-8 h-16 px-4 rounded-lg items-center justify-center bg-primary`}
            >
                <Text className={"text-white"}>사진 목록</Text>
            </TouchableOpacity>
        </View>
    );
}
