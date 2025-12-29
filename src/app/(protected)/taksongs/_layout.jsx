import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function TaksongsLayout() {
    const commonOptions = {
        headerShown: true,
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { color: '#ffffff' }
    }

    const commonOptionBackVisible = {
        ...commonOptions,
        headerBackVisible: true,
    }

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
                    title: '탁송 목록',
                    headerLeft: () => <DrawerToggleButton tintColor={'white'} />,
                    ...commonOptions,
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: '탁송 상세',
                    headerLeft: undefined,
                    ...commonOptionBackVisible
                }}
            />
            <Stack.Screen
                name="[id]/confirm"
                options={{
                    title: '예약 완료',
                    headerLeft: undefined,
                    headerRight: () => <DrawerToggleButton tintColor={'white'} />,
                    ...commonOptionBackVisible
                }}
            />
            <Stack.Screen
                name="[id]/prepare"
                options={{
                    title: '사진 촬영 안내',
                    ...commonOptionBackVisible
                }}
            />
            <Stack.Screen
                name="[id]/camera"
                options={{
                    title: '차량번호 확인',
                    ...commonOptionBackVisible
                }}
            />
            <Stack.Screen
                name="[id]/photos"
                options={{
                    title: '사진 촬영',
                    ...commonOptionBackVisible
                }}
            />
            <Stack.Screen
                name="[id]/complete"
                options={{
                    title: '탁송 완료',
                    ...commonOptionBackVisible
                }}
            />
            <Stack.Screen
                name="[id]/cameraOutline"
                options={{
                    title: '차량 촬영',
                    ...commonOptionBackVisible
                }}
            />
        </Stack>
    )
}
