// app/(protected)/profile.js
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

export default function ProfileScreen() {
    const { logout } = useAuth()

    return (
        <View className={"flex-1 bg-black p-4"}>
            <TouchableOpacity
                className="items-center rounded-lg bg-default p-4"
                onPress={logout}
            >
                <Text className="text-lg font-semibold text-white">로그아웃</Text>
            </TouchableOpacity>
        </View>
    );
}
