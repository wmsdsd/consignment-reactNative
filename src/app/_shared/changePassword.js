import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDriverChangePassword } from '@/hooks/useApi';

export default function changePasswordPage({ from }) {
    const { phone } = useLocalSearchParams()
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
            passwordCheck: null
        },
    })
    const changePasswordMutation = useDriverChangePassword()
    
    const onSubmit = async (data) => {
        try {
            if (data.password === data.passwordCheck) {
                const sendData = {
                    phone: phone,
                    password: data.password
                }
                await changePasswordMutation.mutateAsync(sendData)

                Alert.alert('비밀번호 변경', "비밀번호가 변경 되었습니다.")

                if (from === "login") {
                    router.push("/(auth)/login")
                    router.dismissAll()
                }
                else if (from === "profile") {
                    router.back()
                }
            }
            else {
                Alert.alert('비밀번호 확인', "비밀번호 확인이 일치하지 않습니다.")
            }
        }
        catch (error) {
            console.log(error)
            Alert.alert('전송 오류', "비밀번호 변경에 실패하였습니다.")
        }
    }

    return (
        <View
            className={"p-8"}
            style={{
                flex: 1,
                backgroundColor: '#000000',
            }}
        >
            <Text className={"text-white font-bold text-[28px]"}>비밀번호를</Text>
            <Text className={"text-white font-bold text-[28px]"}>변경해 주세요.</Text>
            <View className={"mt-8"}>
                <View>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: '비밀번호를 입력해 주세요.',
                            pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
                                message: '비밀번호는 6~20자, 영문+숫자를 포함해야 합니다.',
                            },
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
                <View className={"mt-2"}>
                    <Controller
                        control={control}
                        name="passwordCheck"
                        rules={{
                            required: '비밀번호 확인을 입력해 주세요.',
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="rounded-lg border border-color-input bg-input p-4 text-base mb-2"
                                placeholder="비밀번호 확인"
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
                    {errors.passwordCheck && (
                        <Text className="mb-2 text-sm text-red-500">{errors.passwordCheck.message}</Text>
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
                        <Text className="text-lg font-semibold text-white">비밀번호 변경</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
