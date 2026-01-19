import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

function confirmDisclosure(title, text) {
    return new Promise((resolve) => {
        Alert.alert(title, text, [
                {
                    text: "취소",
                    style: "cancel",
                    onPress: () => resolve(false),
                },
                {
                    text: "동의 하고 시작",
                    onPress: () => resolve(true),
                },
            ],
            { cancelable: false }
        )
    })
}

export async function getLocationPermission() {
    const { status: currentStatus } = await Location.getForegroundPermissionsAsync()
    if (currentStatus === "granted") return currentStatus

    const title = "위치 권한 사용 안내"
    const text = "위치정보: 주문 진행 중 기사님의 이동 기록 저장 및 고객 안내를 위해 사용됩니다.\n" +
        "앱 실행 중(포그라운드) 30초마다 위치가 서버로 전송될 수 있습니다.\n" +
        "주문 진행 중 앱이 닫혀 있거나 백그라운드 상태에서도 이동 기록 저장을 위해 위치정보가 수집 및 서버로 전송될 수 있습니다.\n"
    const agreed = await confirmDisclosure(title, text)
    if (!agreed) return "denied"

    const { status } = await Location.requestForegroundPermissionsAsync()
    return status
}

export async function getCameraPermissions() {
    let { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync()
    if (cameraStatus === "granted") return cameraStatus

    const title = "카메라 권한 사용 안내"
    const text = "카메라: 차량 상태/서류 사진 촬영을 위해 사용됩니다."
    const agreed = await confirmDisclosure(title, text)
    if (!agreed) return "denied"

    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    return status
}

export async function getGalleryPermissions() {
    let { status: galleryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync()
    if (galleryStatus === "granted") return galleryStatus

    const title = "갤러리 권한 사용 안내"
    const text = "사진/미디어(갤러리): 촬영한 사진을 업로드 하거나 첨부하기 위해 사용 됩니다."
    const agreed = await confirmDisclosure(title, text)
    if (!agreed) return "denied"

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    return status
}

export async function checkAllPermissionsAsync() {
    try {
        const locationStatus = await getLocationPermission()
        const cameraStatus = await getCameraPermissions()
        const galleryStatus = await getGalleryPermissions()

        // === ⚠️ 요약 ===
        const allGranted =
            locationStatus === 'granted' &&
            cameraStatus === 'granted' &&
            galleryStatus === 'granted'

        if (!allGranted) {
            Alert.alert(
                '권한이 필요합니다',
                '위치, 카메라, 사진 접근 권한이 모두 허용되어야 앱을 정상적으로 사용할 수 있습니다.',
            )
        }

        return { locationStatus, cameraStatus, galleryStatus, allGranted }
    } catch (error) {
        Alert.alert('오류 발생', '권한을 확인하는 중 문제가 발생했습니다.')
        return null
    }
}
