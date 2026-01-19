import { CameraView, useCameraPermissions } from 'expo-camera'
import {View, TouchableOpacity, Text, Alert, ActivityIndicator, ToastAndroid, Image, Dimensions} from 'react-native';
import { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router'
import {useOrder, useOrderLocationProcess} from '@/hooks/useApi'
import {isAndroid} from "@/lib/platform";

export default function TakePhotosScreen() {
    const { id } = useLocalSearchParams()
    const { data: order } = useOrder(id)
    const { data: orderLocation, refetch: refetchOrderLocation } = useOrderLocationProcess(id)

    const { width } = Dimensions.get("window")

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
        if (!cameraRef.current) return

        setIsLoading(true)

        const result = await cameraRef.current.takePictureAsync({
            quality: 0.5,
            base64: false,
            exif: false,
            skipProcessing: false
        })

        if (result && result.uri) {
            const formData = new FormData()
            formData.append('image', {
                uri: result.uri,
                name: 'carPlate.jpg',
                type: 'image/jpeg'
            })

            try {
                const res = await fetch(plateUrl, {
                    method: "POST",
                    body: formData,
                })

                if (res.ok) {
                    const data = await res.json()
                    if (data?.plates?.length > 0) {
                        const carNumber = data.plates[0]?.plate
                        console.log("carNumber", carNumber)
                        if (orderLocation.carNumber !== carNumber) {
                            Alert.alert("알림", "인식된 번호판과 차량 번호가 일치하지 않습니다.")
                        }
                        else {
                            onSuccess()
                        }
                    }
                    else {
                        Alert.alert("알림", "번호판이 인식되지 않았습니다. 번호판만 나오게 다시 찍어주세요.")
                    }
                }
                else {
                    Alert.alert('오류', '이미지 용량이 너무 큽니다. 다시 촬영해주세요.')
                }
            }
            catch (e) {
                console.log('fetch error', e)
                Alert.alert("알림", "사진 정보가 올바르지 않습니다.")
            }
            finally {
                setIsFailed(true)
            }
        }

        setIsLoading(false)
    }

    const onSuccess = () => {
        router.dismissAll()
        router.push({
            pathname: `/(protected)/taksongs/${id}/photos`
        })
    }

    const onPassCarPlate = () => {
        Alert.alert(
            "번호판 인식 넘어가기",
            `현재 차량의 번호판이 ${orderLocation.carNumber}가 맞습니까? \n번호 확인을 반드시 해주세요.`,
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '확인',
                    onPress: onSuccess,
                },
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
                    display: 'flex'
                }}
            >
                <View></View>
                <View>
                    <Text>전면 01</Text>
                    <Text>해당 이미지의 촬영 구도와 맞추어서 촬영해 주세요.</Text>
                </View>
            </View>
        </View>
    );
}
