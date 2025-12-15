// app/(protected)/settings.js
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
    const { logout } = useAuth()
    
    return (
        <View className="bg-black flex flex-1 p-8">
            <View>
                <Text className={"color-white"}>알림 목록 이동</Text>
            </View>
            <View>
                <Text className={"color-white"}>위치 정보 동의 여부</Text>
            </View>
            <View>
                <Text className={"color-white"}>카메라 동의 여부</Text>
            </View>
            <View>
                <Text className={"color-white"}>푸시 알림 동의 여부</Text>
            </View>
            <TouchableOpacity
                className="items-center rounded-lg bg-default p-4"
                onPress={logout}
            >
                <Text className="text-lg font-semibold text-white">로그아웃</Text>
            </TouchableOpacity>
        </View>
    );
}
