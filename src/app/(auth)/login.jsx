import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      // 로그인 성공 시 홈으로 이동 (useAuth에서 자동으로 처리됨)
      router.replace('/(protected)/(tabs)/home');
    } catch (error) {
      Alert.alert('로그인 실패', error.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <View className="flex-1 bg-white px-5">
      <View className="flex-1 justify-center items-center">
        <Image 
          source={require('../../../assets/logo.png')} 
          className="w-56 h-56 mb-8"
          resizeMode="contain"
        />
      </View>
      
      <View className="pb-20">
        <View className="mb-6">
          <Controller
            control={control}
            name="username"
            rules={{ 
              required: '아이디를 입력해주세요.',
              minLength: { value: 2, message: '아이디는 최소 2자 이상이어야 합니다.' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-4 mb-2 text-base bg-gray-50"
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
            <Text className="text-red-500 text-sm mb-2">{errors.username.message}</Text>
          )}
        </View>
        
        <View className="mb-8">
          <Controller
            control={control}
            name="password"
            rules={{ 
              required: '비밀번호를 입력해주세요.',
              minLength: { value: 6, message: '비밀번호는 최소 6자 이상이어야 합니다.' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-4 mb-2 text-base bg-gray-50"
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
            <Text className="text-red-500 text-sm mb-2">{errors.password.message}</Text>
          )}
        </View>
        
        <TouchableOpacity 
          className={`rounded-lg py-5 items-center mt-4 ${
            isSubmitting ? 'bg-gray-400' : 'bg-blue-500'
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text className="text-white text-lg font-semibold">
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}