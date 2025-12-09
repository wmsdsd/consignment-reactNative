import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import CustomDrawerToggle from "@/components/CustomDrawerToggle";
import {createContext, useRef} from "react";

export const OpenMenuContext = createContext(null)
export default function TaksongsLayout() {
    const openMenuRef = useRef({})

    return (
        <OpenMenuContext.Provider value={openMenuRef}>
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
                        title: '탁송 목록',
                        headerLeft: () => <DrawerToggleButton tintColor="#ffffff" />,
                        headerStyle: { backgroundColor: '#000000' },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: { color: '#ffffff' },
                    }}
                />
                <Stack.Screen
                    name="[id]"
                    options={{
                        headerShown: true,
                        title: '탁송 상세',
                        headerBackVisible: true,
                        headerLeft: undefined,
                        headerStyle: { backgroundColor: '#000000' },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: { color: '#ffffff' },
                    }}
                />
                <Stack.Screen
                    name="[id]/confirm"
                    options={{
                        headerShown: true,
                        title: '예약 완료',
                        headerBackVisible: true,
                        headerLeft: undefined,
                        headerRight: () => <DrawerToggleButton tintColor={"#fff"} />,
                        headerStyle: { backgroundColor: '#000000' },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: { color: '#ffffff' },
                    }}
                />
                <Stack.Screen
                    name="[id]/prepare"
                    options={{
                        headerShown: true,
                        title: '사진 촬영 안내',
                        headerBackVisible: true,
                        headerStyle: { backgroundColor: '#000000' },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: { color: '#ffffff' },
                    }}
                />
                <Stack.Screen
                    name="[id]/camera"
                    options={{
                        headerShown: true,
                        title: '차량번호 확인',
                        headerBackVisible: true,
                        headerStyle: { backgroundColor: '#000000' },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: { color: '#ffffff' },
                    }}
                />
                <Stack.Screen
                    name="[id]/photos"
                    options={{
                        headerShown: true,
                        title: '사진 촬영',
                        headerBackVisible: true,
                        headerStyle: { backgroundColor: '#000000' },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: { color: '#ffffff' },
                    }}
                />
                <Stack.Screen
                    name="[id]/complete"
                    options={{
                        headerShown: true,
                        title: '탁송 완료',
                        headerBackVisible: true,
                        headerStyle: { backgroundColor: '#000000' },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: { color: '#ffffff' },
                    }}
                />
            </Stack>
        </OpenMenuContext.Provider>
    )
}
