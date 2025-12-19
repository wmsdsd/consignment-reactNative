import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useActionLock } from '@/hooks/useActionLock';
import { router } from 'expo-router';

export default function ProfileScreen() {
    const { user } = useAuth()
    const { runOnce } = useActionLock()

    const onPressHistory = async () => {
        await runOnce(() => {
            router.push("(protected)/profile/history/index")
        })
    }

    const onPressNotification = async () => {
        await runOnce(() => {
            router.push("(protected)/profile/notification/index")
        })
    }

    const onPressMyInfo = async () => {
        await runOnce(() => {
            router.push("(protected)/profile/myInfo")
        })
    }

    const onPressSettings = async () => {
        await runOnce(() => {
            router.push("(protected)/profile/settings")
        })
    }

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
                        className={"flex-col items-center"}
                        onPress={onPressNotification}
                    >
                        <Ionicons name="notifications-outline" size={20} color="#fff" />
                        <Text className={"color-white text-sm"}>알림</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className={'bg-block flex-1 rounded-t-lg'}>
                <View className={"m-4"}>
                    <Text className={"font-color-label font-sm"}>내 설정</Text>
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