import { router, Stack } from 'expo-router';
import CustomBackButton from '@/components/CustomBackButton';
import { Pressable, Text } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

export default function ProfileLayout() {
    const commonHeaderStyle = (visible) => {
        const result = {
            headerShown: true,
            headerStyle: { backgroundColor: '#000000' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { color: '#ffffff' },
        }

        if (visible) {
            result.headerBackVisible = true
        }

        return result
    }

    return (
        <ActionSheetProvider>
            <Stack
                screenOptions={{
                    headerShown: true,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: '프로필',
                        headerLeft: () => <CustomBackButton onPress={() => {
                            router.back()
                        }} />,
                        ...commonHeaderStyle(false)
                    }}
                />
                <Stack.Screen
                    name="info/index"
                    options={{
                        title: '내 정보',
                        headerRight: () => (
                            <Pressable
                                className={"mr-4"}
                                onPress={() => {
                                    router.setParams({ edit: true })
                                }}
                            >
                                <Text className={"font-color"}>수정하기</Text>
                            </Pressable>
                        ),
                        ...commonHeaderStyle(true)
                    }}
                />
                <Stack.Screen
                    name="info/verifyPassword"
                    options={{
                        title: '비밀번호 확인',
                        ...commonHeaderStyle(true)
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        title: '설정',
                        ...commonHeaderStyle(true)
                    }}
                />
                <Stack.Screen
                    name="notification/index"
                    options={{
                        title: '알림 목록',
                        ...commonHeaderStyle(true)
                    }}
                />
                <Stack.Screen
                    name="history/index"
                    options={{
                        title: '탁송 기록',
                        ...commonHeaderStyle(true)
                    }}
                />
                <Stack.Screen
                    name="history/details"
                    options={{
                        title: '탁송 기록 상세',
                        ...commonHeaderStyle(true)
                    }}
                />
            </Stack>
        </ActionSheetProvider>
    )
}
