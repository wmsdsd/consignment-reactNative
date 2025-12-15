import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function registerPage() {
    const { phone } = useLocalSearchParams()

    const [passwordCheck, setPasswordCheck] = useState(null)

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

    return (
        <View className={"p-8 flex-1 items-center justify-center bg-black"}>>
            <Text className={"text-white font-bold text-[28px]"}>회원가입을 위해</Text>
            <Text className={"text-white font-bold text-[28px]"}>정보를 입력해 주세요.</Text>
            <View className={"mt-8"}>

            </View>
        </View>
    );
}
