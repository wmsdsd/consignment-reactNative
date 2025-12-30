import { CameraView, useCameraPermissions } from 'expo-camera'
import { View, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { isFileUnder2MB } from '@/lib/utils';
import { useAutoOrientation } from '@/hooks/useAutoOrientation';
import { useImageUriStore } from '@/store/useImageUriStore';

const layoutImages = {
    front: require("@assets/images/sample/car_front.png")
}

export default function CameraOutlineScreen() {
    useAutoOrientation()

    const { id, type } = useLocalSearchParams()

    const cameraRef = useRef(null)
    const [permission, requestPermission] = useCameraPermissions()
    const [photoUri, setPhotoUri] = useState(null)

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
            quality: 0.5,
            base64: false,
            exif: false,
            skipProcessing: true
        })

        if (!result || !result.uri) return

        const uri = result.uri
        const isUnder = await isFileUnder2MB(uri)

        if (!isUnder) {
            Alert.alert("알림", "파일 크기는 5MB 이하만 가능합니다.")
            return
        }

        setPhotoUri(uri)
    }

    const onSuccess = () => {
        if (!photoUri) return

        useImageUriStore.getState().setImageUri(photoUri, type)
        router.back()
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#000'
            }}
        >
            {/* ----- 카메라 화면 ----- */}
            {photoUri ? (
                <Image source={{ uri: photoUri }} style={{ flex: 1 }} />
            ) : (
                <CameraView
                    style={{ flex: 1 }}
                    ref={cameraRef}
                    facing="back"
                />
            )}

            {/* ----- 레이아웃 ----- */}
            {!photoUri && (
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
                        className={'w-[550px] h-[330px]'}
                        source={layoutImages['front']}
                        resizeMode={'contain'}
                    />
                </View>
            )}

            {/* ----- 커스텀 촬영 버튼 UI ----- */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 40,
                    alignSelf: 'center',
                }}
            >
                {photoUri ? (
                    <View className={"flex-row mb-8 gap-4"}>
                        <TouchableOpacity
                            onPress={() => setPhotoUri(null)}
                            className={`items-center justify-center`}
                        >
                            <Text className={"color-white"}>다시찍기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onSuccess}
                            className={`items-center justify-center`}
                        >
                            <Text className={"color-white"}>사진 사용</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={takePicture}
                        className={`mb-8 h-16 w-16 items-center justify-center rounded-full border-4 border-white`}
                    >
                        <View className="h-12 w-12 rounded-full bg-primary" />
                    </TouchableOpacity>
                )}
            </View>

        </View>
    );
}
