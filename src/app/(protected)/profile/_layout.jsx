import { router, Stack } from 'expo-router';
import CustomBackButton from '@/components/CustomBackButton';

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: '프로필',
                    headerLeft: () => <CustomBackButton onPress={() => {
                        router.back()
                    }} />,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
            <Stack.Screen
                name="myInfo"
                options={{
                    headerShown: true,
                    title: '내 정보',
                    headerBackVisible: true,
                    headerLeft: undefined, // Stack의 기본 뒤로가기 버튼 사용
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: true,
                    title: '설정',
                    headerBackVisible: true,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
            <Stack.Screen
                name="notifications"
                options={{
                    headerShown: true,
                    title: '알림 목록',
                    headerBackVisible: true,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
            <Stack.Screen
                name="history"
                options={{
                    headerShown: true,
                    title: '탁송 기록',
                    headerBackVisible: true,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
            <Stack.Screen
                name="history/details"
                options={{
                    headerShown: true,
                    title: '탁송 기록 상세',
                    headerBackVisible: true,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
        </Stack>
    );
}
