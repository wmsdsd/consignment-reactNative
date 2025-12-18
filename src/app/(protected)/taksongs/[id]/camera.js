import { CameraView, useCameraPermissions } from 'expo-camera'
import { View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router'
import { useOrderLocationProcess } from '@/hooks/useApi'
import * as ImageManipulator from 'expo-image-manipulator';

const plateUrl = "https://plate.olgomobility.com/recognize/"

export default function CustomCameraScreen() {
    const { id} = useLocalSearchParams()
    const { data: orderLocation } = useOrderLocationProcess(id)

    const [permission, requestPermission] = useCameraPermissions()
    const [isLoading, setIsLoading] = useState(false)
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
            skipProcessing: true
        })

        if (result && result.uri) {
            const image = await ImageManipulator.manipulateAsync(
                result.uri,
                [{ resize: { width: 1024 } }],
                {
                    compress: 0.6,
                    format: ImageManipulator.SaveFormat.JPEG
                }
            )
            const formData = new FormData()

            formData.append('image', {
                uri: image.uri,
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
                        const carNumber = data.plates[0]
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
                    const text = await res.text()
                    console.error('server error:', res.status, text);
                    Alert.alert('오류', '이미지 용량이 너무 큽니다. 다시 촬영해주세요.')
                }
            }
            catch (e) {
                console.log('fetch error', e)
                Alert.alert("알림", "사진 정보가 올바르지 않습니다.")
            }
        }

        setIsLoading(false)
    }

    const onSuccess = () => {
        router.push({
            pathname: `/(protected)/taksongs/${id}/photos`
        })
    }

    const PLATE_WIDTH = 250
    const PLATE_HEIGHT = 150
    const bgColor = 'rgba(0,0,0,0.6)'

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
                        height: '50%',
                        backgroundColor: bgColor,
                        marginTop: -PLATE_HEIGHT / 2,
                    }}
                />

                {/* 가운데 (좌/우) */}
                <View style={{ flexDirection: 'row' }}>
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
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: bgColor,
                        }}
                    />
                </View>

                {/* 아래 */}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: bgColor,
                    }}
                />
            </View>

            {/* ----- 커스텀 촬영 버튼 UI ----- */}
            <View
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
                    borderWidth: 2,
                    borderColor: '#d30000',
                    top: '50%',
                    left: '50%',
                    transform: [
                        { translateX: -PLATE_WIDTH / 2 }, // width의 절반
                        { translateY: -PLATE_HEIGHT / 2 }, // height의 절반
                    ],
                }}
            >
            </View>

        </View>
    );
}
