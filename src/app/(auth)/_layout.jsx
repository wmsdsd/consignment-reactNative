import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

export default function AuthLayout() {
    const headerOptions = {
        headerTitle: "",
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: "#000" },
        headerShadowVisible: false,
    }
    
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="verification" options={headerOptions} />
            <Stack.Screen name="changePassword" options={headerOptions} />
            <Stack.Screen name="register" options={headerOptions} />
        </Stack>
    )
}
