import * as Notifications from 'expo-notifications'
import { useEffect } from "react"
import { useRouter } from 'expo-router'

export function useNotification() {

    const router = useRouter()

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,   // 🔔 배너 표시
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    })

    const moveToOrder = (uid) => {
        router.push({
            pathname: `/(protected)/taksongs`,
            params: {
                id: uid
            }
        })
    }

    useEffect(() => {
        const receiveSub = Notifications.addNotificationReceivedListener(notification => {
            console.log('foreground 알림 클릭:', notification)
        })

        const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('알림 클릭:', response)

            const { data } = response.notification.request.content
            const { uid } = JSON.stringify(data ?? {})
            if (uid) {
                moveToOrder(uid)
            }
        })

        return () => {
            receiveSub.remove()
            responseSub.remove()
        }
    }, [])
}

export async function registerForPushToken() {
    if (!Device.isDevice) {
        alert('실제 기기에서만 푸시 가능');
        return;
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('알림 권한 거부됨');
        return;
    }

    const token = (
        await Notifications.getExpoPushTokenAsync()
    ).data;

    console.log('Expo Push Token:', token);

    return token;
}
