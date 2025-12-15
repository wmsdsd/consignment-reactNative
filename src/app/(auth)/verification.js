import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDriverSendAuthCode, useDriverVerify } from '@/hooks/useApi';
import { secondToTime } from '@/lib/utils';

export default function verificationPage() {
    const { text, type } = useLocalSearchParams()
    
    const authCodeMutation = useDriverSendAuthCode()
    const verifyMutation = useDriverVerify()
    
    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        },
    } = useForm({
        defaultValues: {
            phone: null,
            code: null
        },
    })
    
    const messageTime = 300
    const [send, setSend] = useState(false)
    const [timeStamp, setTimeStamp] = useState(messageTime)
    const [timeInterval, setTimeInterval] = useState(0)
    
    const onSendPhone = async (data) => {
        try {
            await authCodeMutation.mutateAsync(data)
            setSend(true)
            onClearTimeInterval()
            onStartTimeInterval()
        }
        catch (error) {
            setSend(false)
            console.log("error: ", error)
            Alert.alert('전송 오류', "휴대폰과 일치하는 계정이 존재하지 않습니다.")
        }
    }
    
    const onResendPhone = async (data) => {
        const limits = (6 * 4) + 30
        if (timeStamp < limits) {
            await onSendPhone(data)
        }
        else {
            Alert.alert('재전송 제한', `${timeStamp - limits}초뒤 재전송 가능합니다.`)
        }
    }
    
    const onSubmit = async (data) => {
        try {
            await verifyMutation.mutateAsync(data)
            onClearTimeInterval()

            if (type === 'password') {
                router.replace({
                    pathname: '/(auth)/changePassword',
                    params: {
                        phone: data.phone
                    }
                })
            }
            if (type === 'register') {
                router.replace({
                    pathname: '/(auth)/register',
                    params: {
                        phone: data.phone
                    }
                })
            }
            
        }
        catch (error) {
            console.log("error: ", error)
            Alert.alert('인증 실패', "인증에 실패하였습니다.")
        }
    }
    
    const onStartTimeInterval = () => {
        const interval = setInterval(() => {
            setTimeStamp(prev => prev - 1)

            if (timeStamp === 0) {
                onClearTimeInterval()
                setSend(false)
                Alert.alert('인증 시간 초과', "인증시간이 초과 되었습니다. 다시 시도해주세요.")
            }
        }, 1000)
        
        setTimeInterval(interval)
    }
    
    const onClearTimeInterval = () => {
        if (timeInterval) {
            clearInterval(timeInterval)
            setTimeInterval(null)
            setTimeStamp(messageTime)
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
            <Text className={"text-white font-bold text-[28px]"}>{ text }을 위해</Text>
            <Text className={"text-white font-bold text-[28px]"}>본인인증을 해주세요.</Text>
            <View className={"mt-8"}>
                <View className={"flex flex-row gap-4"}>
                    <View className={"flex flex-1"}>
                        <Controller
                            control={control}
                            name="phone"
                            rules={{
                                required: '휴대폰 번호를 입력해 주세요.',
                                pattern: {
                                    value: /^[0-9]{10,11}$/,
                                    message: '휴대폰 번호를 확인해 주세요.',
                                },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className="rounded-lg border border-color-input bg-input p-4 text-base mb-2"
                                    placeholder="휴대전화번호 (-없이)"
                                    placeholderTextColor={"#BBBBBB"}
                                    value={value}
                                    onChangeText={(text) => {
                                        const onlyNumber = text.replace(/[^0-9]/g, '')
                                        onChange(onlyNumber)
                                    }}
                                    onBlur={onBlur}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="number-pad"
                                    maxLength={11}
                                />
                            )}
                        />
                        {errors.phone && (
                            <Text className="mb-2 text-sm text-red-500">{errors.phone.message}</Text>
                        )}
                    </View>
                    <View>
                        <TouchableOpacity
                            className={`items-center rounded-lg py-4 w-[80px] bg-primary`}
                            onPress={send ? handleSubmit(onResendPhone) : handleSubmit(onSendPhone)}
                            disabled={authCodeMutation.isPending}
                        >
                            <Text className="text-lg font-semibold text-white">{ send ? '재전송' : '전송'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                { send && (
                    <View>
                        <View style={{ position: 'relative' }}>
                            <Controller
                                control={control}
                                name="code"
                                rules={{
                                    required: '인증번호를 입력해 주세요.',
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="rounded-lg border border-color-input bg-input p-4 text-base mb-2"
                                        placeholder="인증번호"
                                        placeholderTextColor={"#BBBBBB"}
                                        value={value}
                                        onChangeText={(text) => {
                                            const onlyNumber = text.replace(/[^0-9]/g, '')
                                            onChange(onlyNumber)
                                        }}
                                        onBlur={onBlur}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                )}
                            />
                            {timeStamp !== messageTime && (
                                <Text
                                    style={{
                                        position: 'absolute',
                                        right: 15,
                                        top: '50%',
                                        transform: [{ translateY: -10 }], // 텍스트 높이 절반
                                        fontSize: 14,
                                        color: '#999',
                                    }}
                                >
                                    {secondToTime(timeStamp)}
                                </Text>
                            )}
                            {errors.code && (
                                <Text className="mb-2 text-sm text-red-500">{errors.code.message}</Text>
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
                                <Text className="text-lg font-semibold text-white">
                                    {isSubmitting ? '인증 중 ...' : '인증하기'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
