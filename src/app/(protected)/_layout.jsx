// app/(protected)/_layout.js
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { View, Text, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@/hooks/useAuth'
import { formatPhone } from '@/lib/utils'
import { useAppContext } from '@/context/AppContext'
import { useEffect, useRef } from 'react';

const CustomDrawerContent = props => {
    const insets = useSafeAreaInsets()
    const { user } = useAuth()

    return (
        <View className="flex-1 bg-[#1E1E1E]">
            {/* 유저 정보 헤더 */}
            <View
                className="border-b border-gray-700 bg-[#1E1E1E] px-8 pb-4"
                style={{ paddingTop: insets.top + 16 }}
            >
                <View className="flex-row items-center gap-4 mb-2">
                    <Image
                        source={
                            user?.profileImage
                                ? { uri: user.profileImage }
                                : require("../../../assets/ic_profile_default.png")
                        }
                        className="w-14 h-14"
                    />
                    <View>
                        <View className="mb-2">
                            <Text className="text-2xl font-bold text-white font-bold">{ user?.name } 기사님</Text>
                        </View>
                        <Text className="text-sm text-gray-400 text-white">{ formatPhone(user?.phone) }</Text>
                    </View>
                </View>
            </View>
            
            {/* Drawer 메뉴 리스트 */}
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8 }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );
};

CustomDrawerContent.displayName = 'CustomDrawerContent'

export default function ProtectedLayout() {
    const { menuConfig } = useAppContext()

    return (
        <GestureHandlerRootView className="flex-1 bg-black">
            <Drawer
                drawerContent={props => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: true,
                    drawerType: 'front',
                    drawerStyle: { width: 260, backgroundColor: '#1E1E1E' },
                    drawerActiveTintColor: '#ffffff',
                    drawerInactiveTintColor: '#888888',
                    drawerItemStyle: {
                        borderRadius: 8,
                        marginHorizontal: 8,
                        marginVertical: 2,
                    },
                    drawerPosition: menuConfig.direction,
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { color: '#ffffff' },
                    contentStyle: { backgroundColor: '#000000' },
                }}
            >
                <Drawer.Screen
                    name="taksongs"
                    options={{
                        drawerIcon: ({ focused, size, color}) => (
                            <Image
                                source={require("../../../assets/menu/ic_car.png")}
                                style={{
                                    width: size,
                                    height: size,
                                    tintColor: focused ? "#fff" : "#888"
                                }}
                            />
                        ),
                        drawerLabel: '탁송 목록',
                        title: '탁송 목록',
                        headerShown: false,
                        drawerItemStyle: menuConfig.direction === 'right'
                            ? { display: 'none' }
                            : {},
                    }}
                />
                <Drawer.Screen
                    name="profile"
                    options={{
                        drawerIcon: ({ focused, size, color}) => (
                            <Image
                                source={require("../../../assets/menu/ic_profile.png")}
                                style={{
                                    width: size,
                                    height: size,
                                    tintColor: focused ? "#fff" : "#888"
                                }}
                            />
                        ),
                        drawerLabel: '프로필',
                        title: '프로필',
                        headerShown: false,
                        drawerItemStyle: menuConfig.direction === 'right'
                            ? { display: 'none' }
                            : {},
                    }}
                />
                {/*<Drawer.Screen*/}
                {/*    name="settings"*/}
                {/*    options={{*/}
                {/*        drawerIcon: ({ focused, size, color}) => (*/}
                {/*            <Image*/}
                {/*                source={require("../../../assets/menu/ic_setting.png")}*/}
                {/*                style={{*/}
                {/*                    width: size,*/}
                {/*                    height: size,*/}
                {/*                    tintColor: focused ? "#fff" : "#888"*/}
                {/*                }}*/}
                {/*            />*/}
                {/*        ),*/}
                {/*        drawerLabel: '설정',*/}
                {/*        title: '설정',*/}
                {/*        drawerItemStyle: menuConfig.direction === 'right'*/}
                {/*            ? { display: 'none' }*/}
                {/*            : {},*/}
                {/*    }}*/}
                {/*/>*/}
                <Drawer.Screen
                    name="prices"
                    options={{
                        drawerLabel: '요금 청구',
                        title: '요금 청구',
                        headerShown: false,
                        drawerItemStyle: menuConfig.direction === 'right'
                            ? {}
                            : { display: 'none' },
                    }}
                />
                <Drawer.Screen
                    name="accident"
                    options={{
                        drawerLabel: '사고 접수',
                        title: '사고 접수',
                        headerShown: false,
                        drawerItemStyle: menuConfig.direction === 'right'
                            ? {}
                            : { display: 'none' },
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
