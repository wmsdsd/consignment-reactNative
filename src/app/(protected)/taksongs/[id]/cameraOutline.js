import { CameraView, useCameraPermissions } from 'expo-camera'
import { View, TouchableOpacity, Text, Alert, ActivityIndicator, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useOrderLocation, useOrderLocationProcess } from '@/hooks/useApi';
import * as ImageManipulator from 'expo-image-manipulator';
import { isFileUnder2MB } from '@/lib/utils';

const layoutImages = {
    front: require("@assets/images/sample/car_front.png")
}

export default function CameraOutlineScreen() {
    const { id, type } = useLocalSearchParams()
    // const { data } = useOrderLocation(orderLocationUid)

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

        try {
            if (!result || !result.uri) return

            const uri = result.uri
            const isUnder = await isFileUnder2MB(uri)

            if (!isUnder) {
                Alert.alert("알림", "파일 크기는 5MB 이하만 가능합니다.")
                return
            }

            console.log("result.uri", uri)

            // const image = await ImageManipulator.manipulateAsync(
            //     result.uri,
            //     [{ resize: { width: 1024 } }],
            //     {
            //         compress: 0.6,
            //         format: ImageManipulator.SaveFormat.JPEG
            //     }
            // )
            // const formData = new FormData()
            //
            // formData.append('image', {
            //     uri: image.uri,
            //     name: 'carPlate.jpg',
            //     type: 'image/jpeg'
            // })
            //
            // try {
            //     const res = await fetch(plateUrl, {
            //         method: "POST",
            //         body: formData,
            //     })
            //
            //     if (res.ok) {
            //         const data = await res.json()
            //         if (data?.plates?.length > 0) {
            //             const carNumber = data.plates[0]
            //             if (orderLocation.carNumber !== carNumber) {
            //                 Alert.alert("알림", "인식된 번호판과 차량 번호가 일치하지 않습니다.")
            //             }
            //             else {
            //                 onSuccess()
            //             }
            //         }
            //         else {
            //             Alert.alert("알림", "번호판이 인식되지 않았습니다. 번호판만 나오게 다시 찍어주세요.")
            //         }
            //     }
            //     else {
            //         Alert.alert('오류', '이미지 용량이 너무 큽니다. 다시 촬영해주세요.')
            //     }
            // }
            // catch (e) {
            //     console.log('fetch error', e)
            //     Alert.alert("알림", "사진 정보가 올바르지 않습니다.")
            // }

        }
        finally {
            setIsLoading(false)
        }
    }

    const onSuccess = (uri) => {
        router.back()

        // 뒤로 가면서 데이터 전달
        router.setParams({
            capturedPhoto: uri,
        })
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
                style={{ flex: 1 }}
                ref={cameraRef}
                facing="back"
            />

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

            {/* ----- 레이아웃 ----- */}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0.5,
                    backgroundColor: 'transparent'
                }}
            >
                <Image
                    className={'w-full'}
                    source={layoutImages['front']}
                />
            </View>
        </View>
    );
}
