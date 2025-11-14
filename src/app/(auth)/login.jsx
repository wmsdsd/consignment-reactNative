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
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  // const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [keyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      event => {
        Animated.timing(keyboardHeight, {
          duration: Platform.OS === 'ios' ? 250 : 200,
          toValue: event.endCoordinates.height,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          duration: Platform.OS === 'ios' ? 250 : 200,
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const onSubmit = async data => {
    try {
      // await login(data);
      // 로그인 성공 시 홈으로 이동 (useAuth에서 자동으로 처리됨)
      router.replace('/(protected)/(tabs)/home');
    } catch (error) {
      Alert.alert('로그인 실패', error.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <View className="bg-primary flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            className="flex-1 px-5"
            style={{
              paddingBottom: Platform.OS === 'android' ? keyboardHeight : undefined,
            }}
          >
            <Animated.View
              className="flex-1 items-center justify-center px-5"
              style={{
                transform:
                  Platform.OS === 'ios'
                    ? [
                        {
                          translateY: keyboardHeight.interpolate({
                            inputRange: [0, 300],
                            outputRange: [0, -10],
                            extrapolate: 'clamp',
                          }),
                        },
                      ]
                    : undefined,
              }}
            >
              <Image
                source={require('../../../assets/logo_main.png')}
                className="mb-8 h-48 w-48"
                resizeMode="contain"
              />

              <View className="w-full">
                <View className="mb-4">
                  <Controller
                    control={control}
                    name="username"
                    rules={{
                      required: '아이디를 입력해주세요.',
                      minLength: { value: 2, message: '아이디는 최소 2자 이상이어야 합니다.' },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className="mb-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-base"
                        placeholder="아이디"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    )}
                  />
                  {errors.username && (
                    <Text className="mb-2 text-sm text-red-500">{errors.username.message}</Text>
                  )}
                </View>

                <View className="mb-6">
                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: '비밀번호를 입력해주세요.',
                      minLength: { value: 6, message: '비밀번호는 최소 6자 이상이어야 합니다.' },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className="mb-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-base"
                        placeholder="비밀번호"
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
                    isSubmitting ? 'bg-gray-400' : 'bg-blue-500'
                  }`}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  <Text className="text-lg font-semibold text-white">
                    {isSubmitting ? '로그인 중...' : '로그인'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-3 items-center rounded-lg border-2 border-gray-300 bg-white py-4"
                  onPress={() => router.replace('/(protected)/home')}
                >
                  <Text className="text-lg font-semibold text-gray-700">체험하기</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
