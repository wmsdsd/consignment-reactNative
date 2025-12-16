import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import { useOrderAccident, useOrderAccidentUpdate, useOrderLocationProcess, useOrderPhotoUpload } from '@/hooks/useApi';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert, FlatList,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { dateFormatter, formatDate, isFileUnder2MB } from '@/lib/utils';
import { uriToFileObject } from '@/lib/uriToFile';
import IconButton from '@/components/IconButton';
import { isAndroid } from '@/lib/platform';
import { ACCIDENT_TYPE_OPTIONS } from '@/data/codes';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import KeyboardWrapper from '@/components/KeyboardWrapper'
import { useRemovePhoto } from '@/hooks/useRemovePhoto'
import ImageThumbnail from '@/components/ImageThumbnail'

const MAX_COUNT = 10
export default function AccidentUpdateScreen() {
    const { id } = useLocalSearchParams()
    const insets = useSafeAreaInsets()

    const [photoList, setPhotoList] = useState([null])
    const [typeModalVisible, setTypeModalVisible] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedParam, setSelectedParam] = useState(null)

    const { data: orderAccident } = useOrderAccident(id)
    const { data: orderLocation } = useOrderLocationProcess(id)

    const uploadMutation = useOrderPhotoUpload()
    const updateMutation = useOrderAccidentUpdate()

    const {
        control,
        watch,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm()
    const accidentType = watch('type')

    const handleTakePicture = async () => {
        if (photoList.length === MAX_COUNT) {
            Alert.alert(`최대 ${MAX_COUNT}장 까지 촬영이 가능합니다.`)
            return
        }

        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== "granted") {
            Alert.alert("카메라 권한이 필요합니다!")
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 0.8,
        })

        if (!result.canceled) {
            const uri = result.assets[0].uri
            const isUnder = await isFileUnder2MB(uri)

            if (!isUnder) {
                Alert.alert("알림", "파일 크기는 5MB 이하만 가능합니다.")
                await handleTakePicture()
            }
            else {
                const file = await uriToFileObject(uri)
                const orderPhotos = await uploadMutation.mutateAsync({
                    orderUid: id,
                    orderLocationUid: orderLocation.uid,
                    orderAccidentUid: orderAccident?.uid,
                    type: "ACCIDENT",
                    position: "ACCIDENT",
                    fileList: [
                        {
                            fileName: file.name,
                            fileType: file.type
                        }
                    ]
                })

                if (Array.isArray(orderPhotos) && orderPhotos.length > 0) {
                    const orderPhoto = orderPhotos[0]
                    await fetch(orderPhoto.url, {
                        method: "PUT",
                        headers: {
                            'Content-Type': file.type,
                        },
                        body: file.blob
                    })

                    const list = photoList.filter(e => e !== null)
                    setPhotoList([...list, orderPhoto])
                }
                else {
                    Alert.alert("알림", "이미지 등록에 실패 하였습니다. 네트워크 상태를 확인해 주세요.")
                }
            }
        }
    }

    const onSubmit = async sendData => {
        let title = ''
        let message = ''
        if (sendData.category === "COMPLETE") {
            title = "사고 완료"
            message = "작성해 주신 내용으로 사고 완료 처리를 진행하시겠습니까?"
        }
        else {
            title = "사고 내용 수정"
            message = "작성해 주신 내용으로 사고 내용을 수정하시겠습니까?"
        }

        Alert.alert(title, message, [
                { text: '취소', style: 'cancel' },
                {
                    text: '확인',
                    onPress: async () => {
                        await updateMutation.mutateAsync(sendData)

                        if (isAndroid) {
                            ToastAndroid.show("처리 되었습니다.", ToastAndroid.SHORT)
                        }

                        router.back()
                    },
                },
            ])
    }

    const handleComplete = () => {
        if (accidentType === "NONE") {
            if (isAndroid) {
                ToastAndroid.show("사고 종류를 선택해 주세요.", ToastAndroid.SHORT)
            }

            return
        }


        setValue('category', "COMPLETE")
        handleSubmit(onSubmit)
    }

    const handleDateChange = (event, date) => {
        if (date && selectedParam) {
            const newDate = getValues(selectedParam)
                ? getValues(selectedParam)
                : new Date(date)

            newDate.setHours(selectedDate.getHours())
            newDate.setMinutes(selectedDate.getMinutes())

            setValue(selectedParam, newDate)
        }

        setShowDatePicker(false)
        setSelectedParam(null)
    }

    const handleTimeChange = (event, date) => {
        setShowTimePicker(false)
        if (date && selectedParam) {
            const newDate = getValues(selectedParam)
                ? getValues(selectedParam)
                : new Date(date)

            newDate.setHours(date.getHours())
            newDate.setMinutes(date.getMinutes())

            setValue(selectedParam, newDate)
        }

        setShowDatePicker(false)
        setSelectedParam(null)
    }

    const { removePhoto } = useRemovePhoto({
        photoList,
        setPhotoList
    })

    const renderImage = useCallback(({ item }) => (
        <ImageThumbnail item={item} onRemove={removePhoto} />
    ), [removePhoto])

    useEffect(() => {
        setPhotoList([null])

        if (orderAccident) {
            console.log("order accident", orderAccident)
            reset({
                ...orderAccident,
                selfPayment: String(orderAccident.selfPayment ?? ""),
            })

            if (Array.isArray(orderAccident.orderPhotos) && orderAccident.orderPhotos.length > 0) {
                setPhotoList(orderAccident.orderPhotos)
            }
        }
    }, [orderAccident?.uid])

    return (
        <View className={"flex-1 bg-black"}>
            <KeyboardWrapper>
                <ScrollView>
                    <View className={"flex-1 p-4"}>
                        <Text className="mb-4 text-xl font-bold text-white">사고 처리</Text>

                        <View className={"mb-4 w-full rounded-xl bg-[#1E1E1E] p-4"}>
                            <View className={"flex flex-row mb-1"}>
                                <Text className="text-xl font-bold text-white">접수 정보</Text>
                            </View>
                            <View className={"flex flex-row mb-1"}>
                                <Text className="w-32 text-gray-400">차량번호</Text>
                                <Text className="flex-1 text-white">{getValues('carNumber')}</Text>
                            </View>
                            <View className={"flex flex-row"}>
                                <Text className="w-32 text-gray-400">연락처</Text>
                                <Text className="flex-1 text-white">{getValues('phone')}</Text>
                            </View>
                            <View className={"flex flex-row"}>
                                <Text className="w-32 text-gray-400">사고 발생 일시</Text>
                                <Text className="flex-1 text-white">{dateFormatter(getValues('accidentDate'))}</Text>
                            </View>
                        </View>

                        <Controller
                            name={"type"}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <View className={"mb-4"}>
                                    <Text className="mb-2 text-base text-gray-300">사고 처리</Text>
                                    <TouchableOpacity
                                        className={"mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"}
                                        onPress={() => setTypeModalVisible(true)}
                                    >
                                        <Text className={value ? "color-white" : "color-[#aaa]"}>
                                            {value ? ACCIDENT_TYPE_OPTIONS.find(e => e.value === value)?.label : "선택해주세요."}
                                        </Text>
                                    </TouchableOpacity>

                                    {/*Modal*/}
                                    <Modal
                                        visible={typeModalVisible}
                                        transparent
                                        animationType={"fade"}
                                    >
                                        <View className={"flex-1 justify-center items-center bg-[rgba(0,0,0,0.3)]"}>
                                            <View className={"bg-block w-[250px] p-2 rounded-lg"}>
                                                { ACCIDENT_TYPE_OPTIONS.map((item) => (
                                                    <TouchableOpacity
                                                        className={"p-4 border-b border-gray-700"}
                                                        key={item.value}
                                                        onPress={() => {
                                                            onChange(item.value)
                                                            setTypeModalVisible(false)
                                                        }}
                                                    >
                                                        <Text className={"color-white"}>{item.label}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                                <TouchableOpacity
                                                    className={"mt-2 p-3 bg-neutral-800 rounded-lg items-center"}
                                                    onPress={() => setTypeModalVisible(false)}
                                                >
                                                    <Text className={"color-white"}>취소</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            )}
                        />

                        { accidentType === "INSURANCE" && (
                            <>
                                <View className="mb-4">
                                    <Text className="mb-2 text-base text-gray-300">접보 번호 (보험사 접수 번호)</Text>
                                    <Controller
                                        control={control}
                                        name="claimNumber"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                                placeholder="접보 번호를 입력해주세요."
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
                                    <Text className="mb-2 text-base text-gray-300">보험사</Text>
                                    <Controller
                                        control={control}
                                        name="insuranceCompany"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                                placeholder="보험사를 입력해주세요."
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
                                    <Text className="mb-2 text-base text-gray-300">공업사</Text>
                                    <Controller
                                        control={control}
                                        name="serviceCenter"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                                placeholder="공업사를 입력해주세요."
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
                            </>
                        )}

                        { accidentType !== "NONE" && (
                            <>
                                <View className="mb-4">
                                    <Text className="mb-2 text-base text-gray-300">
                                        {accidentType === "INSURANCE" && ("자기 부담금")}
                                        {accidentType === "AGREEMENT" && ("합의금")}
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="selfPayment"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                                placeholder="금액을 입력해주세요."
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
                                    <Text className="mb-2 text-base text-gray-300">
                                        {accidentType === "INSURANCE" && ("수리 내용")}
                                        {accidentType === "AGREEMENT" && ("합의 내용")}
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="fixedContent"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base h-[120px]"
                                                placeholder="내용을 입력해주세요. (500자 미만)"
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
                                </View>
                            </>
                        )}

                        {accidentType === "INSURANCE" && (
                            <>
                                <View className="mb-4">
                                    <Text className="mb-2 text-base text-gray-300">수리 시작일시</Text>
                                    <View className="flex-row gap-3">
                                        <Pressable
                                            onPress={() => {
                                                const date = getValues('fixedStartDate')
                                                if (date) {
                                                    setSelectedDate(date)
                                                }
                                                setSelectedParam('fixedStartDate')
                                                setShowDatePicker(true)
                                            }}
                                            className="flex-1 rounded-xl bg-white px-4 py-3"
                                        >
                                            <Text className="text-base font-medium text-black">
                                                { getValues('fixedStartDate') ? formatDate(getValues('fixedStartDate')) : "날짜 선택"} ▼
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => {
                                                const date = getValues('fixedStartDate')
                                                if (date) {
                                                    setSelectedDate(date)
                                                }
                                                setSelectedParam('fixedStartDate')
                                                setShowTimePicker(true)
                                            }}
                                            className="flex-1 rounded-xl bg-white px-4 py-3"
                                        >
                                            <Text className="text-base font-medium text-black">
                                                { getValues('fixedStartDate') ? formatDate(getValues('fixedStartDate')) : "시간 선택"} ▼
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <View className="mb-4">
                                    <Text className="mb-2 text-base text-gray-300">수리 시작일시</Text>
                                    <View className="flex-row gap-3">
                                        <Pressable
                                            onPress={() => {
                                                const date = getValues('fixedEndDate')
                                                if (date) {
                                                    setSelectedDate(date)
                                                }
                                                setSelectedParam('fixedEndDate')
                                                setShowDatePicker(true)
                                            }}
                                            className="flex-1 rounded-xl bg-white px-4 py-3"
                                        >
                                            <Text className="text-base font-medium text-black">
                                                { getValues('fixedEndDate') ? formatDate(getValues('fixedEndDate')) : "날짜 선택"} ▼
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => {
                                                const date = getValues('fixedEndDate')
                                                if (date) {
                                                    setSelectedDate(date)
                                                }
                                                setSelectedParam('fixedEndDate')
                                                setShowTimePicker(true)
                                            }}
                                            className="flex-1 rounded-xl bg-white px-4 py-3"
                                        >
                                            <Text className="text-base font-medium text-black">
                                                { getValues('fixedEndDate') ? formatDate(getValues('fixedEndDate')) : "시간 선택"} ▼
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </>
                        )}
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                minimumDate={new Date()}
                            />
                        )}
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
                            <Text className="text-base text-gray-300">사진 정보</Text>
                            <FlatList
                                data={photoList}
                                renderItem={renderImage}
                                keyExtractor={(_, index) => index.toString()}
                                numColumns={3}
                                className={"px-2 mt-2"}
                                scrollEnabled={false}
                            />
                        </View>

                    </View>
                </ScrollView>
            </KeyboardWrapper>
            <View
                className={"border-t border-gray-800 bg-black p-4"}
                style={{ paddingBottom: Math.max(insets.bottom, 60) }}
            >
                <View className={"w-full flex-row gap-3"}>
                    <View className={"bg-default flex justify-center items-center w-[60] rounded-lg"}>
                        <IconButton onPress={handleTakePicture} name={"camera"} />
                    </View>

                    <Pressable
                        onPress={handleSubmit(onSubmit)}
                        className="flex-1 rounded-xl bg-btn py-4"
                        disabled={isSubmitting}
                    >
                        <Text className="text-center text-lg font-semibold text-white">
                            { isSubmitting ? "수정 중 ..." : "정보 수정" }
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleComplete}
                        className="flex-1 rounded-xl bg-primary py-4"
                        disabled={isSubmitting}
                    >
                        <Text className="text-center text-lg font-semibold text-white">사고 완료</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}