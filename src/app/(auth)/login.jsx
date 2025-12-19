import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import KeyboardWrapper from '@/components/KeyboardWrapper'

export default function LoginPage() {
    const { login } = useAuth()
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            id: '',
            password: '',
        },
    })

    const onSubmit = async data => {
        try {
            await login(data)
        } catch (error) {
            Alert.alert('로그인 실패', error.message || '로그인에 실패했습니다.');
        }
    };
    
    const onFindPassword = () => {
        router.push({
            pathname: '/(auth)/verification',
            params: {
                text: "비밀번호 변경",
                type: "password",
                root: "/(auth)/login"
            }
        })
    }

    const onHandleRegister = () => {
        router.push({
            pathname: '/(auth)/verification',
            params: {
                text: "회원가입",
                type: "register"
            }
        })
    }
    
    return (
        <View className="bg-black flex-1">
            <KeyboardWrapper>
                <Animated.View className="flex-1 px-5">
                    <Animated.View className="flex-1 items-center justify-center px-5">
                        <Image
                            source={require('@assets/logo/logo_main.png')}
                            className="mb-8 h-48 w-48"
                            resizeMode="contain"
                        />
                        
                        <View className="w-full">
                            <View className="mb-4">
                                <Controller
                                    control={control}
                                    name="id"
                                    rules={{
                                        required: '아이디를 입력해주세요.',
                                        minLength: { value: 2, message: '아이디는 최소 2자 이상이어야 합니다.' },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                            placeholder="아이디"
                                            placeholderTextColor={"#BBBBBB"}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                    )}
                                />
                                {errors.id && (
                                    <Text className="mb-2 text-sm text-red-500">{errors.id.message}</Text>
                                )}
                            </View>
                            
                            <View className="mb-6">
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: '비밀번호를 입력해주세요.',
                                        minLength: {
                                            value: 1,
                                            message: '비밀번호는 최소 1자 이상이어야 합니다.'
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                            placeholder="비밀번호"
                                            placeholderTextColor={"#BBBBBB"}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <Text className="mb-2 text-sm text-red-500">{errors.password.message}</Text>
                                )}
                            </View>
                            
                            <TouchableOpacity
                                className={`mt-2 items-center rounded-lg py-4 ${
                                    isSubmitting ? 'bg-gray-400' : 'bg-primary'
                                }`}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                            >
                                <Text className="text-lg font-semibold text-white">
                                    {isSubmitting ? '로그인 중...' : '로그인'}
                                </Text>
                            </TouchableOpacity>
                            
                            <View className="flex flex-row justify-center items-center my-4">
                                <TouchableOpacity onPress={onFindPassword}>
                                    <Text className="text-sm font-semibold text-white pl-4">비밀번호 찾기</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity
                                className="mt-3 items-center rounded-lg border-2 border-gray-300 bg-white py-4"
                                onPress={() => router.replace('/(protected)/home')}
                            >
                                <Text className="text-lg font-semibold text-gray-700">체험하기</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </KeyboardWrapper>
        </View>
    );
}