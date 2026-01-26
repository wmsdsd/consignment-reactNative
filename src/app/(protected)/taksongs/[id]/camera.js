import { CameraView, useCameraPermissions } from 'expo-camera'
import {View, TouchableOpacity, Text, Alert, ActivityIndicator, ToastAndroid} from 'react-native';
import { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router'
import { useOrderLocationProcess } from '@/hooks/useApi'
import {isAndroid} from "@/lib/platform";

const plateUrl = "https://plate.olgomobility.com/yolo/recognize"
const PLATE_WIDTH = 250
const PLATE_HEIGHT = 150
const TOP = "46%"
const BOTTOM = "54%"
const bgColor = 'rgba(0,0,0,0.5)'

export default function CustomCameraScreen() {
    const { id} = useLocalSearchParams()
    const { data: orderLocation } = useOrderLocationProcess(id)

    const [permission, requestPermission] = useCameraPermissions()
    const [isLoading, setIsLoading] = useState(false)
    const [isFailed, setIsFailed] = useState(false)
    const cameraRef = useRef(null)

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
        const startTime = Date.now()

        if (!cameraRef.current) return

        try {
            setIsLoading(true)

            const result = await cameraRef.current.takePictureAsync({
                quality: 0.5,
                base64: false,
                exif: false,
                skipProcessing: false
            })

            if (!result || !result.uri) return

            const formData = new FormData()
            formData.append('image', {
                uri: result.uri,
                name: 'carPlate.jpg',
                type: 'image/jpeg'
            })

            const res = await fetch(plateUrl, {
                method: "POST",
                body: formData,
            })

            if (!res?.ok) {
                if (isAndroid)
                    ToastAndroid.show('이미지 용량이 너무 큽니다. 다시 촬영해주세요.', ToastAndroid.SHORT)
                return
            }

            const data = await res.json()
            const length = data?.plates?.length

            if (length <= 0) {
                if (isAndroid)
                    ToastAndroid.show("번호판이 인식되지 않았습니다. 번호판만 나오게 다시 찍어주세요.", ToastAndroid.SHORT)
                return
            }

            const carNumber = data.plates[0]?.plate
            if (orderLocation.carNumber !== carNumber) {
                if (isAndroid)
                    ToastAndroid.show("인식된 번호판과 차량 번호가 일치하지 않습니다.", ToastAndroid.SHORT)
            }
            else {
                onSuccess()
            }

        }
        catch (e) {
            Alert.alert("알림", "[오류] 사진 정보가 올바르지 않습니다.")
        }
        finally {
            setIsLoading(false)
            setIsFailed(true)

            // const endTime = Date.now()
            // const elapsed = endTime - startTime
            // if (isAndroid)
                // ToastAndroid.show(`경과 시간: ${elapsed / 1000}초`, ToastAndroid.SHORT)
        }
    }

    const onSuccess = () => {
        router.dismissAll()
        router.push({
            pathname: `/(protected)/taksongs/${id}/takePhotos`
        })
    }

    const onPassCarPlate = () => {
        Alert.alert(
            "번호판 인식 넘어가기",
            `현재 차량의 번호판이 ${orderLocation.carNumber}가 맞습니까? \n번호 확인을 반드시 해주세요.`,
            [
                { text: '취소', style: 'cancel' },
                { text: '확인', onPress: onSuccess },
            ]
        )
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

            {/* ====== 어두운 오버레이 ====== */}
            <View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                {/* 위 */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: TOP,
                        marginTop: -PLATE_HEIGHT / 2,
                        backgroundColor: bgColor,
                    }}
                />

                {/* 아래 */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: BOTTOM,
                        marginBottom: -PLATE_HEIGHT / 2,
                        backgroundColor: bgColor,
                    }}
                />

                {/* 가운데 (좌/우) */}
                <View style={{
                    position: 'absolute',
                    top: TOP,
                    marginTop: -PLATE_HEIGHT / 2,
                    flexDirection: 'row',
                    width: '100%',
                    height: PLATE_HEIGHT,
                }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: bgColor,
                        }}
                    />

                    {/* 투명 영역 */}
                    <View
                        style={{
                            width: PLATE_WIDTH,
                            height: PLATE_HEIGHT,
                            backgroundColor: "transparent",
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: bgColor,
                        }}
                    />
                </View>

            </View>

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
                    className={`mb-8 h-16 w-16 items-center justify-center rounded-full border-4 border-white 
                        ${ isLoading ? "bg-gray-400" : 'bg-white'}
                    `}
                    disabled={isLoading}
                >
                    { isLoading
                        ? (<ActivityIndicator color={"fff"} />)
                        : (<View className="h-12 w-12 rounded-full bg-primary" />)
                    }
                </TouchableOpacity>
            </View>

            {/* ----- 차량 번호판 영역 지정 ----- */}
            <View
                style={{
                    position: 'absolute',
                    width: PLATE_WIDTH,
                    height: PLATE_HEIGHT,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: '#d30000',
                    top: TOP,
                    left: '50%',
                    transform: [
                        { translateX: -PLATE_WIDTH / 2 }, // width의 절반
                        { translateY: -PLATE_HEIGHT / 2 }, // height의 절반
                    ],
                }}
            >
            </View>

            {/* ----- 넘어가기 ----- */}
            { isFailed && (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        right: 40,
                    }}
                    onPress={onPassCarPlate}
                    className={`mb-8 ml-8 h-16 px-4 rounded-lg items-center justify-center 
                        ${ isLoading ? "bg-gray-400" : 'bg-primary'}
                    `}
                    disabled={isLoading}
                >
                    <Text className={"text-white"}>번호 확인</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
