import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useActionLock } from '@/hooks/useActionLock';
import { router } from 'expo-router';
import { usePushNotificationList } from '@/hooks/useApi';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
    const { user } = useAuth()
    const { runOnce } = useActionLock()
    const { data: list } = usePushNotificationList()
    const [count, setCount] = useState(0)

    const onPressHistory = async () => {
        await runOnce(() => {
            router.push("profile/history")
        })
    }

    const onPressNotification = async () => {
        await runOnce(() => {
            router.push("profile/notification")
        })
    }

    const onPressMyInfo = async () => {
        await runOnce(() => {
            router.push("profile/info")
        })
    }

    const onPressSettings = async () => {
        await runOnce(() => {
            router.push("profile/settings")
        })
    }

    useEffect(() => {
        if (list && Array.isArray(list)) {
            setCount(list.length)
        }
    }, [list])

    return (
        <View className={"flex-1 bg-black p-4"}>
            <View className={"p-4"}>
                <View className={"flex-row items-center"}>
                    <View className={"mr-4"}>
                        <Image
                            source={
                                user?.profileImage
                                    ? { uri: user.profileImage }
                                    : require("@assets/ic_profile_default.png")
                            }
                            className="w-14 h-14 rounded-lg"
                        />
                    </View>
                    <View>
                        <Text className={"font-color font-bold text-lg"}>{user?.name}</Text>
                    </View>
                </View>
                <View className={"p-5 mt-6 flex-row justify-around items-center bg-default rounded-lg"}>
                    <TouchableOpacity
                        className={"flex-col items-center"}
                        onPress={onPressHistory}
                    >
                        <Ionicons name="receipt-outline" size={20} color="#fff" />
                        <Text className={"color-white text-sm"}>탁송기록</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={"flex-col items-center relative"}
                        onPress={onPressNotification}
                    >
                        <Ionicons name="notifications-outline" size={20} color="#fff" />
                        <Text className={"color-white text-sm"}>알림</Text>
                        {count > 0 && (
                            <View className={`absolute -top-2  rounded-full bg-dispute flex justify-center items-center
                                ${count < 10
                                    ? "w-5 h-5 -right-2"
                                    : count < 100
                                        ? "w-7 h-5 -right-4"
                                        : "w-9 h-5 -right-5"
                                    }
                                `}
                            >
                                <Text className={"text-xs color-white"}>{count > 99 ? "99+" : count}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <View className={'bg-block flex-1 rounded-t-lg'}>
                <View className={"m-4"}>
                    <Text className={"font-color-label text-sm"}>내 설정</Text>
                </View>
                <TouchableOpacity
                    onPress={onPressMyInfo}
                    className={"flex-row mx-2 p-4"}
                >
                    <Text className={"flex-1 font-base color-white"}>내 정보</Text>
                    <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPressSettings}
                    className={"flex-row mx-2 p-4"}
                >
                    <Text className={"flex-1 font-base color-white"}>설정</Text>
                    <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </TouchableOpacity>
            </View>
        </View>
    )
}