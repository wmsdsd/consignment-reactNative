import { Stack } from 'expo-router';

export default function AccidentLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen
                name={"receive"}
                options={{
                    headerShown: true,
                    title: '사고 접수',
                    headerBackVisible: true,
                    headerLeft: undefined,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
            <Stack.Screen
                name={"complete"}
                options={{
                    headerShown: true,
                    title: "사고 처리",
                    headerBackVisible: true,
                    headerLeft: undefined,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                }}
            />
        </Stack>
    )
}