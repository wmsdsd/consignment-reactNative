export default {
    expo: {
        name: '올고 드라이버',
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
            buildNumber: "1",
            icon: './assets/logo/logo.png',
            infoPlist: {
                NSLocationWhenInUseUsageDescription: '탁송 진행 중 기사 위치를 확인하고 배송 상태를 관리하기 위해 사용됩니다.',
                NSLocationAlwaysAndWhenInUseUsageDescription: '탁송 진행 중 기사 위치 추적 및 배송 이력 기록을 위해 백그라운드에서도 위치를 사용합니다.',
                NSCameraUsageDescription: '이 앱은 탁송 서비스에서 사용되는 차량 사진, 번호판 사진 촬영을 위해 카메라 접근 권한이 필요합니다.',
                NSMicrophoneUsageDescription: '이 앱은 탁송 서비스에서 사용되는 영상 녹화 시 오디오 녹음을 위해 마이크 접근 권한이 필요합니다.',
                NSPhotoLibraryUsageDescription: '이 앱은 탁송 서비스에서 사용되는 사진 업로드를 위해 앨범 접근 권한이 필요합니다.',
            },
            UIBackgroundModes: [
                "location",
                "fetch"
            ],
            newArchEnabled: false,
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
                    locationAlwaysAndWhenInUsePermission: '본 앱은 사용자 위치정보를 서버로 전송하여 [배송 관리/기록 등] 목적에만 사용합니다. 앱 화면 내에서는 위치정보를 표시하거나 사용하지 않습니다.',
                    locationAlwaysPermission: '본 앱은 사용자 위치정보를 서버로 전송하여 [배송 관리/기록 등] 목적에만 사용합니다. 앱 화면 내에서는 위치정보를 표시하거나 사용하지 않습니다.',
                    locationWhenInUsePermission: '본 앱은 사용자 위치정보를 서버로 전송하여 [배송 관리/기록 등] 목적에만 사용합니다. 앱 화면 내에서는 위치정보를 표시하거나 사용하지 않습니다.',
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
            [
                "expo-build-properties",
                {
                    "android": {
                        "minifyEnabled": true,
                        "shrinkResources": true
                    }
                }
            ]
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
