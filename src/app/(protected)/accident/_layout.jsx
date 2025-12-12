import { router, Stack } from 'expo-router';
import CustomBackButton from '@/components/CustomBackButton';

export default function AccidentLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen
                name={"index"}
                options={{
                    headerShown: true,
                    title: '사고 접수',
                    headerLeft: () => <CustomBackButton onPress={() => {
                        router.back()
                    }} />,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
            <Stack.Screen
                name={"[id]/update"}
                options={{
                    headerShown: true,
                    title: "사고 처리",
                    headerLeft: () => <CustomBackButton onPress={() => {
                        router.back()
                    }} />,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
        </Stack>
    )
}