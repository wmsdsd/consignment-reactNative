import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useDriverVerifyPassword } from '@/hooks/useApi';
import React from 'react';

export default function VerifyPasswordScreen() {
    const { id, phone } = useLocalSearchParams()
    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        },
    } = useForm({
        defaultValues: {
            password: null,
        },
    })

    const verifyMutation = useDriverVerifyPassword()

    const onSubmit = async (data) => {
        try {
            const res = await verifyMutation.mutateAsync({
                id: id,
                password: data.password
            })
            if (res) {
                router.push({
                    pathname: '/(auth)/changePassword',
                    params: {
                        phone: phone,
                        root: "(protected)/profile/myInfo"
                    }
                })
            }
            else {
                Alert.alert('알림', "비밀번호가 일치하지 않습니다.")
            }
        }
        catch (error) {
            console.log(error)
            Alert.alert('전송 오류', "인터넷 연결을 확인해 주세요.")
        }
    }

    return (
        <View className={"p-8 flex-1 bg-black"}>
            <Text className={"text-white font-bold text-[28px]"}>비밀번호를</Text>
            <Text className={"text-white font-bold text-[28px]"}>입력해 주세요.</Text>
            <View className={"mt-8"}>
                <View>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: '비밀번호를 입력해 주세요.'
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="rounded-lg border border-color-input bg-input p-4 text-base mb-2"
                                placeholder="비밀번호"
                                placeholderTextColor={"#BBBBBB"}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry
                            />
                        )}
                    />
                    {errors.password && (
                        <Text className="mb-2 text-sm text-red-500">{errors.password.message}</Text>
                    )}
                </View>
                <View>
                    <TouchableOpacity
                        className={`mt-2 items-center rounded-lg py-4 ${
                            isSubmitting ? 'bg-gray-400' : 'bg-primary'
                        }`}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        <Text className="text-lg font-semibold text-white">비밀번호 확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}