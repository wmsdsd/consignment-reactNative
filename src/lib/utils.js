import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export async function checkAllPermissionsAsync() {
    try {
        // === 📍 위치 권한 ===
        let { status: locationStatus } = await Location.getForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
            const { status } = await Location.requestForegroundPermissionsAsync();
            locationStatus = status;
        }
        
        // === 📸 카메라 권한 (expo-image-picker 사용) ===
        let { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            cameraStatus = status;
        }
        
        // === 🖼️ 앨범 접근 권한 ===
        let { status: galleryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (galleryStatus !== 'granted') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            galleryStatus = status;
        }
        
        // === ⚠️ 요약 ===
        const allGranted =
            locationStatus === 'granted' && cameraStatus === 'granted' && galleryStatus === 'granted';
        
        if (!allGranted) {
            Alert.alert(
                '권한이 필요합니다',
                '위치, 카메라, 사진 접근 권한이 모두 허용되어야 앱을 정상적으로 사용할 수 있습니다.',
            );
        }
        
        return { locationStatus, cameraStatus, galleryStatus, allGranted };
    } catch (error) {
        console.error('권한 체크 중 오류:', error);
        Alert.alert('오류 발생', '권한을 확인하는 중 문제가 발생했습니다.');
        return null;
    }
}
