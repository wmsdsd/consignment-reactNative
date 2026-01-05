import { useAppContext } from '@/context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Pressable,
    Text,
    TextInput,
    ToastAndroid,
    View,
    Animated,
    ScrollView,
} from 'react-native';
import { useOrderAccidentReceive, useOrderLocationProcess } from '@/hooks/useApi';
import { isAndroid } from '@/lib/platform';
import { router } from 'expo-router';
import { formatDate, formatDatetime, formatTime } from '@/lib/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardWrapper from '@/components/KeyboardWrapper'
import { useDateTimePicker } from '@/hooks/useDatetimePicker';

export default function AccidentReceiveScreen() {
    const { menuConfig } = useAppContext()
    const insets = useSafeAreaInsets()

    const [orderUid, setOrderUid] = useState(null)

    const {
        setShowDatePicker,
        setShowTimePicker,
        selectedDate,
        showDatePicker,
        showTimePicker,
        handleDateChange,
        handleTimeChange
    } = useDateTimePicker()
    const { data: orderLocation } = useOrderLocationProcess(orderUid)

    const receiveMutation = useOrderAccidentReceive()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            carNumber: '',
            phone: '',
            content: '',
        },
    })

    const onSubmit = async data => {
        data.accidentDate = formatDatetime(selectedDate)
        data.orderUid = orderUid
        data.orderLocationUid = orderLocation?.uid

        Alert.alert(
            '사고 접수',
            '사고 내용을 등록하시겠습니까?', [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '확인',
                    onPress: async () => {
                        let res = await receiveMutation.mutateAsync(data)
                        if (res) {
                            if (isAndroid) {
                                ToastAndroid.show("사고 접수 되었습니다.", ToastAndroid.SHORT)
                            }

                            router.replace('/(protected)/taksongs')
                        }
                    },
                },
            ])
    }

    useEffect(() => {
        setOrderUid(menuConfig.orderUid)
    }, [menuConfig.orderUid])

    useEffect(() => {
        reset()
    }, [])

    return (
        <View className={"flex-1 bg-black"}>
            <KeyboardWrapper>
                <Animated.View className={"flex-1"}>
                    <ScrollView>
                        <View className={"w-full p-4"}>
                            <Text className="text-xl font-bold text-white">접수 정보</Text>
                            <Text className="mb-4 ml-1 text-sm text-[#ccc]">1대 이상 사고의 경우 콤마(,)로 구분해 주세요.</Text>

                            <View className="mb-4">
                                <Text className="mb-2 text-base text-gray-300">차량번호 (상대방)</Text>
                                <Controller
                                    control={control}
                                    name="carNumber"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                            placeholder="차량 번호를 입력해 주세요."
                                            placeholderTextColor={"#BBBBBB"}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                    )}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="mb-2 text-base text-gray-300">연락처 (상대방)</Text>
                                <Controller
                                    control={control}
                                    name="phone"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                            placeholder="연락처"
                                            placeholderTextColor={"#BBBBBB"}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType={"numeric"}
                                        />
                                    )}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="mb-2 text-base text-gray-300">사고발생일시</Text>
                                <View className="flex-row gap-3">
                                    <Pressable
                                        onPress={() => setShowDatePicker(true)}
                                        className="flex-1 rounded-xl bg-white px-4 py-3"
                                    >
                                        <Text className="text-base font-medium text-black">{formatDate(selectedDate)} ▼</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => setShowTimePicker(true)}
                                        className="flex-1 rounded-xl bg-white px-4 py-3"
                                    >
                                        <Text className="text-base font-medium text-black">{formatTime(selectedDate)} ▼</Text>
                                    </Pressable>
                                </View>
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleDateChange}
                                    minimumDate={new Date()}
                                />
                            )}

                            {/* TimePicker */}
                            {showTimePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="time"
                                    display="spinner"
                                    onChange={handleTimeChange}
                                    is24Hour={false}
                                />
                            )}

                            <View className="mb-4">
                                <Text className="mb-2 text-base text-gray-300">사고 내용</Text>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "필수 선택 항목입니다."
                                    }}
                                    name="content"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base h-[120px]"
                                            placeholder="사고 내용을 입력해 주세요. (500자 미만)"
                                            placeholderTextColor={"#BBBBBB"}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            multiline={true}
                                            numberOfLines={6}
                                            maxLength={500}
                                            textAlignVertical={"top"}
                                            scrollEnabled={true}
                                            returnKeyType={"default"}
                                        />
                                    )}
                                />
                                {errors.content && (
                                    <Text className="mb-2 text-sm text-red-500">{errors.content.message}</Text>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </Animated.View>
                <View
                    className={"border-t border-gray-800 bg-black p-4"}
                    style={{ paddingBottom: Math.max(insets.bottom, 60) }}
                >
                    <View className={"w-full flex-row"}>
                        <Pressable
                            onPress={handleSubmit(onSubmit)}
                            className="flex-1 rounded-xl bg-btn py-4"
                            disabled={isSubmitting}
                        >
                            <Text className="text-center text-lg font-semibold text-white">
                                { isSubmitting ? "접수 중 ..." : "사고 접수" }
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardWrapper>
        </View>
    )
}