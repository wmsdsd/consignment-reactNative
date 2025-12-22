export default {
    expo: {
        name: 'olgo',
        slug: 'olgo-mobility',
        scheme: 'olgo',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/logo/logo.png',
        userInterfaceStyle: 'light',
        newArchEnabled: true,
        splash: {
            backgroundColor: '#3400A2',
            resizeMode: 'contain',
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.kangja.olgo',
            infoPlist: {
                NSLocationWhenInUseUsageDescription: '이 앱은 위치 기반 기능을 위해 위치 권한이 필요합니다.',
                NSCameraUsageDescription: '이 앱은 사진/영상 촬영을 위해 카메라 접근 권한이 필요합니다.',
                NSMicrophoneUsageDescription: '이 앱은 영상 녹화 시 오디오 녹음을 위해 마이크 접근 권한이 필요합니다.',
                NSPhotoLibraryUsageDescription: '이 앱은 사진 업로드를 위해 앨범 접근 권한이 필요합니다.',
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/icon.png',
                backgroundColor: '#3400A2',
            },
            edgeToEdgeEnabled: true,
            permissions: [
                'ACCESS_FINE_LOCATION',
                'ACCESS_COARSE_LOCATION',
                'ACCESS_BACKGROUND_LOCATION',
                'FOREGROUND_SERVICE',
                'FOREGROUND_SERVICE_LOCATION',
                'CAMERA',
                'RECORD_AUDIO',
                'READ_EXTERNAL_STORAGE',
                'WRITE_EXTERNAL_STORAGE',
            ],
            package: 'com.kangja.olgo',
            usesCleartextTraffic: true,
            googleServicesFile: "./google-services.json",
        },
        web: {
            favicon: './assets/favicon.png',
        },
        plugins: [
            'expo-router',
            'expo-secure-store',
            "expo-notifications",
            [
                'expo-splash-screen',
                {
                    backgroundColor: '#2B00A6',
                    image: './assets/logo/logo.png',
                    resizeMode: 'contain',
                },
            ],
            [
                'expo-image-picker',
                {
                    photosPermission: '탁송 서비스를 위해 사진 선택이 필요합니다.',
                    cameraPermission: '탁송 서비스를 위해 사진 촬영이 필요합니다.',
                },
            ],
            [
                'expo-location',
                {
                    locationAlwaysAndWhenInUsePermission: '탁송 서비스를 위해 위치 정보 수집이 필요합니다.',
                    locationAlwaysPermission: '탁송 서비스를 위해 위치 정보 수집이 필요합니다.',
                    locationWhenInUsePermission: '탁송 서비스를 위해 위치 정보 수집이 필요합니다.',
                    isAndroidBackgroundLocationEnabled: true,
                    isAndroidForegroundServiceEnabled: true,
                },
            ],
            [
                'expo-camera',
                {
                    cameraPermission: '탁송 서비스를 위해 사진 촬영이 필요합니다.',
                    microphonePermission: '탁송 서비스를 위해 마이크 접근이 필요합니다.',
                    recordAudioAndroid: true,
                },
            ],
        ],
        extra: {
            router: {},
            eas: {
                projectId: 'f846f146-ae60-4064-a21d-ba75b82b7d8b',
            },
        },
        owner: 'chominsu',
    },
};
