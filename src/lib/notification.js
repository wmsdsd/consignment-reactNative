import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

export async function setupNotifications() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
}

export async function getPushToken() {
    if (!Device.isDevice) return null

    const { status } = await Notifications.getPermissionsAsync()
    if (status !== 'granted') return null

    const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'f846f146-ae60-4064-a21d-ba75b82b7d8b'
    })

    return token.data
}