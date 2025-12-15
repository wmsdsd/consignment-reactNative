import { CameraView, useCameraPermissions } from 'expo-camera'
import { View, TouchableOpacity, Text, Alert } from 'react-native'
import { useRef } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useOrderLocationProcess } from '@/hooks/useApi'

const plateUrl = "https://plate.olgomobility.com/recognize/"

export default function CustomCameraScreen() {
    const { id} = useLocalSearchParams()
    const { data: orderLocation } = useOrderLocationProcess(id)

    const [permission, requestPermission] = useCameraPermissions()
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

        const result = await cameraRef.current.takePictureAsync({
            quality: 0.8,
            base64: false,
            exif: false,
        })

        if (result && result.uri) {
            const uri = result.uri
            const ext = result.uri.split('.').pop() || 'jpg'
            const formData = new FormData()

            formData.append('image', {
                uri: uri,
                name: `carPlate.${ext}`,
                type: ext === 'jpg' || ext === 'jpeg'
                    ? 'image/jpeg'
                    : `image/${ext}`,
            })

            try {
                const res = await fetch(plateUrl, {
                    method: "POST",
                    body: formData,
                })

                const data = await res.json()
                const status = data?.status
                if (status === 200 && data?.plates?.length > 0) {
                    const carNumber = data.plates[0]
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
            catch (e) {
                console.log('fetch error', e)
                Alert.alert("알림", "사진 정보가 올바르지 않습니다.")
            }
        }
    }

    const onSuccess = () => {
        router.push({
            pathname: `/(protected)/taksongs/${id}/photos`
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {/* ----- 카메라 화면 ----- */}
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
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
                    onPress={onSuccess}
                    className="mb-8 h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white"
                >
                    <View className="h-12 w-12 rounded-full bg-primary" />
                </TouchableOpacity>
            </View>

            {/* ----- 차량 번호판 영역 지정 ----- */}
            <View
                style={{
                    position: 'absolute',
                    width: 250,
                    height: 150,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: '#d30000',
                    top: '50%',
                    left: '50%',
                    transform: [
                        { translateX: -125 }, // width의 절반
                        { translateY: -150 }, // height의 절반
                    ],
                }}
            >
            </View>
        </View>
    );
}
