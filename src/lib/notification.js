import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'expo_push_token'

const checkDevice = () => {
    if (!Device.isDevice) {
        alert('실제 디바이스에서만 Push Notification이 동작합니다.');
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

export async function requestPermission() {
    let isGranted = await getPermission()
    if (isGranted) {
        const { status } = await Notifications.requestPermissionsAsync()
        isGranted = status === 'granted'
    }
    return isGranted
}

export async function getPermission() {
    if (!checkDevice()) return

    const { status } = await Notifications.getPermissionsAsync()
    return status === 'granted'
}

export async function getPushToken() {
    if (!checkDevice()) return

    let isGranted = await requestPermission()
    if (!isGranted) {
        alert('알림 권한이 거부되었습니다. 시스템 설정에서 허용해 주세요.')
        return
    }

    const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
    })

    await setupNotifications()

    console.log("token", token.data)

    return token.data
}

export async function syncPushToken(mutation) {
    const newToken = await getPushToken()
    const oldToken = await AsyncStorage.getItem(TOKEN_KEY)

    if (oldToken !== newToken) {
        mutation.mutateAsync({
            token: newToken
        })
        await AsyncStorage.setItem(TOKEN_KEY, newToken);
    }
}