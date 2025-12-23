import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getCameraPermissions, getGalleryPermissions, getLocationPermission } from '@/lib/permissions';
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import { useDriverProfile, useDriverSetPush } from '@/hooks/useApi';

export default function SettingsScreen() {
    const { user } = useAuth()
    const { data:driver, refetch: refetchDriver } = useDriverProfile(user?.uid)

    const [isPush, setIsPush] = useState(false)
    const [isLocation, setIsLocation] = useState(false)
    const [isCamera, setIsCamera] = useState(false)
    const [isGallery, setIsGallery] = useState(false)

    const trackColor = { false: '#767577', true: '#816DFF' }
    const setPushMutation = useDriverSetPush()

    const onToggleLocation = async (value) => {
        if (value) {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status === 'granted') {
                setIsLocation(true)
            }
            else {
                Alert.alert(
                    '위치 권한 필요',
                    '설정에서 위치 권한을 허용해주세요'
                )
                setIsLocation(false)
            }
        }
        else {
            noAuthorized()
        }
    }

    const onToggleCamera = async (value) => {
        if (value) {
            const { status } = await ImagePicker.requestCameraPermissionsAsync()
            if (status === 'granted') {
                setIsCamera(true)
            }
            else {
                Alert.alert(
                    '카메라 권한 필요',
                    '설정에서 카메라 권한을 허용해주세요'
                )
                setIsCamera(false)
            }
        }
        else {
            noAuthorized()
        }
    }

    const onToggleGallery = async (value) => {
        if (value) {
            const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()
            if (status === 'granted') {
                setIsGallery(true)
            }
            else {
                Alert.alert(
                    '사진 접근 권한 필요',
                    '설정에서 사진 권한을 허용해주세요'
                )
                setIsGallery(false)
            }
        }
        else {
            noAuthorized()
        }
    }

    const onTogglePush = async (value) => {
        const res = await setPushMutation.mutateAsync({
            isPush: value,
        })

        if (res) {
            await refetchDriver()
        }
        else {
            Alert.alert('알림', '푸시 알림 설정에 실패하였습니다. 네트워크 환경을 확인해 주세요.');
        }
    }

    const noAuthorized = () => {
        // ❗ 권한은 앱에서 직접 해제 불가
        Alert.alert('알림', '권한 해제는 시스템 설정에서 가능합니다.');
    }

    useEffect(() => {
        ;(async () => {
            const locationStatus = await getLocationPermission()
            setIsLocation(locationStatus === 'granted')

            const cameraStatus = await getCameraPermissions()
            setIsCamera(cameraStatus === 'granted')

            const galleryStatus = await getGalleryPermissions()
            setIsGallery(galleryStatus === 'granted')
        })()
    }, [])

    useEffect(() => {
        if (driver) {
            setIsPush(driver.isPushNotification)
        }
    }, [driver?.isPushNotification])

    return (
        <View className="bg-black flex flex-1 p-8">
            <View className={"flex-row justify-between items-center mb-4"}>
                <View>
                    <Text className={"color-white text-lg"}>푸시 알림</Text>
                </View>
                <View>
                    <Switch
                        value={isPush}
                        onValueChange={onTogglePush}
                        trackColor={trackColor}
                        thumbColor={isPush ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                    />
                </View>
            </View>
            <View className={"flex-row justify-between items-center mb-4"}>
                <View>
                    <Text className={"color-white text-lg"}>위치 정보</Text>
                </View>
                <View>
                    <View>
                        <Switch
                            value={isLocation}
                            onValueChange={onToggleLocation}
                            trackColor={trackColor}
                            thumbColor={isLocation ? '#fff' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                        />
                    </View>
                </View>
            </View>
            <View className={"flex-row justify-between items-center mb-4"}>
                <View>
                    <Text className={"color-white text-lg"}>카메라</Text>
                </View>
                <View>
                    <Switch
                        value={isCamera}
                        onValueChange={onToggleCamera}
                        trackColor={trackColor}
                        thumbColor={isCamera ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                    />
                </View>
            </View>
            <View className={"flex-row justify-between items-center"}>
                <View>
                    <Text className={"color-white text-lg"}>사진/앨범</Text>
                </View>
                <View>
                    <Switch
                        value={isGallery}
                        onValueChange={onToggleGallery}
                        trackColor={trackColor}
                        thumbColor={isCamera ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                    />
                </View>
            </View>
        </View>
    )
}
