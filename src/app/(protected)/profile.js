// app/(protected)/profile.js
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import {useDriverProfile} from "@/hooks/useApi";
import KeyboardWrapper from "@/components/KeyboardWrapper";

export default function ProfileScreen() {
    const { logout, user } = useAuth()
    const { data: driver } = useDriverProfile(user?.uid)

    console.log("user", user)
    console.log("driver", driver)

    return (
        <View className={"flex-1 bg-black p-4"}>
            <KeyboardWrapper>
                <ScrollView>
                    <View className={"flex justify-center items-center"}>

                    </View>

                    <TouchableOpacity
                        className="items-center rounded-lg bg-default p-4"
                        onPress={logout}
                    >
                        <Text className="text-lg font-semibold text-white">로그아웃</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardWrapper>
        </View>
    );
}
