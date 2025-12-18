// app/(protected)/profile.js
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from 'react';
import {useDriverProfile} from "@/hooks/useApi";
import KeyboardWrapper from "@/components/KeyboardWrapper";
import { useForm } from 'react-hook-form';

export default function MyInfoScreen() {
    const { logout, user } = useAuth()
    const { data: driver } = useDriverProfile(user?.uid)
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            id: '',
            name: '',
            phone: '',
            email: '',

        },
    })

    console.log("user", user)
    console.log("driver", driver)

    useEffect(() => {

    }, [])

    return (
        <View className={"flex-1 bg-black p-4"}>
            <KeyboardWrapper>
                <ScrollView>
                    <View className={"flex justify-center items-center"}>

                    </View>
                    <View>

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
