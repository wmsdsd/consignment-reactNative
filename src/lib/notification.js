import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Alert, Linking, Platform } from 'react-native'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'expo_push_token'

const checkDevice = () => {
    if (!Device.isDevice) {
        alert('실제 디바이스에서만 Push Notification이 동작합니다.')
        return false
    }

    return true
}

export async function setupNotifications() {
    if (!checkDevice()) return

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }
}

export async function requestPushPermission() {
    const { status } = await Notifications.getPermissionsAsync()
    if (status === 'undetermined') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync()
        return newStatus === 'granted'
    }

    return status === 'granted'
}

export async function getPushPermission() {
    if (!checkDevice()) return

    const { status } = await Notifications.getPermissionsAsync()
    return status === 'granted'
}

export async function getPushToken() {
    if (!checkDevice()) return

    let isGranted = await requestPushPermission()
    if (!isGranted) {
        Alert.alert(
            '알림 권한 없음',
            '알림 권한이 거부되었습니다. \n알림을 받으려면 설정 > 알림에서 허용해 주세요.', [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '설정 이동',
                    onPress: () => {
                        Linking.openSettings()
                    },
                },
            ])

        return
    }

    const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
    })

    await setupNotifications()

    return token.data
}

export async function syncPushToken(mutation, checkToken = true) {
    const newToken = await getPushToken()
    if (!newToken) return

    const oldToken = await AsyncStorage.getItem(TOKEN_KEY)

    let updateFlag = true
    if (checkToken) {
        updateFlag = oldToken !== newToken
    }

    if (updateFlag) {
        mutation.mutateAsync({
            token: newToken
        })
        await AsyncStorage.setItem(TOKEN_KEY, newToken);
    }
}