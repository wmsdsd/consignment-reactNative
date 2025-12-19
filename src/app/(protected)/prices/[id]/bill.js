import {
    View,
    Text,
    ScrollView,
    Pressable,
    Alert,
    TouchableOpacity,
    Modal,
    TextInput,
    Image,
    ToastAndroid, FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker'
import { Controller, useForm } from 'react-hook-form';
import React, { useCallback, useState } from 'react';
import { isAndroid } from '@/lib/platform';
import {
    useOrderLocationProcess,
    useOrderPhotoUpload,
    useOrderSettlementSave,
} from '@/hooks/useApi';
import { uriToFileObject } from '@/lib/uriToFile';
import { isFileUnder2MB } from '@/lib/utils';
import { TYPE_OPTIONS } from '@/data/codes';
import ImageThumbnail from '@/components/ImageThumbnail';
import { useRemovePhoto } from '@/hooks/useRemovePhoto';
import { getCameraPermissions } from '@/lib/permissions';

const MAX_COUNT = 3

export default function BillingScreen() {
    const { id } = useLocalSearchParams()
    const insets = useSafeAreaInsets()
    const { data: orderLocation } = useOrderLocationProcess(id)
    const {
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            category: "ADD",
            type: "",
            price: 0,
            comment: "",
            waitTime: 0,
            wayPointDistance: 0,
            orderPhotos: [],
            orderUid: id,
        },
    })
    const type = watch("type")

    const [typeModalVisible, setTypeModalVisible] = useState(false)
    const [photoList, setPhotoList] = useState([null])

    // mutations
    const uploadMutation = useOrderPhotoUpload()
    const saveMutation = useOrderSettlementSave()

    const handleTakePicture = async () => {
        if (photoList.length === MAX_COUNT) {
            Alert.alert(`최대 ${MAX_COUNT}장 까지 촬영이 가능합니다.`)
            return
        }

        const status = await getCameraPermissions()
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
                    type: "SETTLE",
                    position: "SETTLE",
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

    const onSubmit = (data) => {
        data.orderPhotos = photoList

        Alert.alert(
            '요금 청구',
            '요금을 청구하시겠습니까?', [
            { text: '취소', style: 'cancel' },
            {
                text: '확인',
                onPress: async () => {
                    await saveMutation.mutateAsync(data)

                    if (isAndroid) {
                        ToastAndroid.show("추가 되었습니다.", ToastAndroid.SHORT)
                    }

                    router.back()
                },
            },
        ])
    }

    const { removePhoto } = useRemovePhoto({
        photoList,
        setPhotoList
    })

    const renderImage = useCallback(({ item }) => (
        <ImageThumbnail item={item} onRemove={removePhoto} />
    ), [removePhoto])

    return (
        <View className="flex-1 bg-black p-4">
            <View className="flex-1 w-full rounded-2xl bg-neutral-900 p-6">
                <Text className="mb-4 text-xl font-bold text-white">청구 정보</Text>

                {/*요금 청구 종류*/}
                <Controller
                    name={"type"}
                    control={control}
                    rules={{
                        required: "필수 선택 항목입니다."
                    }}
                    render={({ field: { onChange, value } }) => (
                        <View className={"mb-4"}>
                            {/*select box*/}
                            <Text className="mb-2 text-base text-gray-300">요금 종류</Text>
                            <TouchableOpacity
                                className={"mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"}
                                onPress={() => setTypeModalVisible(true)}
                            >
                                <Text className={value ? "color-white" : "color-[#aaa]"}>
                                    {value ? TYPE_OPTIONS.find(e => e.value === value)?.label : "선택해주세요."}
                                </Text>
                            </TouchableOpacity>
                            {errors.type && (
                                <Text className="mb-2 text-sm text-red-500">{errors.type.message}</Text>
                            )}

                            {/*Modal*/}
                            <Modal
                                visible={typeModalVisible}
                                transparent
                                animationType={"fade"}
                            >
                                <View className={"flex-1 justify-center items-center bg-[rgba(0,0,0,0.3)]"}>
                                    <View className={"bg-block w-[250px] p-2 rounded-lg"}>
                                        { TYPE_OPTIONS.map((item) => (
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

                <View className="mb-4">
                    <Text className="mb-2 text-base text-gray-300">금액</Text>
                    <Controller
                        control={control}
                        name="price"
                        rules={{
                            required: '금액을 입력해 주세요.'
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                placeholder="금액"
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
                    {errors.price && (
                        <Text className="mb-2 text-sm text-red-500">{errors.price.message}</Text>
                    )}
                </View>

                {type === "STAY" && (
                    <View className="mb-4">
                        <Text className="mb-2 text-base text-gray-300">대기 시간 (분)</Text>
                        <Controller
                            control={control}
                            name="waitTime"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                    placeholder="분 단위로 입력해 주세요."
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
                )}

                {type === "WAYPOINT" && (
                    <View className="mb-4">
                        <Text className="mb-2 text-base text-gray-300">추가 거리</Text>
                        <Controller
                            control={control}
                            name="wayPointDistance"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                    placeholder="미터(m) 단위로 입력해 주세요."
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
                )}

                <View className="mb-4">
                    <Text className="mb-2 text-base text-gray-300">비고</Text>
                    <Controller
                        control={control}
                        name="comment"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                placeholder="추가 정보를 입력해 주세요."
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
                    <Text className="text-base text-gray-300">사진 정보</Text>
                    <FlatList
                        data={photoList}
                        renderItem={renderImage}
                        keyExtractor={(_, index) => index.toString()}
                        numColumns={3}
                        className={"px-2 mt-2"}
                    />
                </View>
            </View>

            {/* Footer - 영수증 첨부 및 요금 청구 버튼 */}
            <View
                className="border-t border-gray-800 bg-black px-4 py-4"
                style={{ paddingBottom: Math.max(insets.bottom, 60) }}
            >
                <View className="w-full flex-row gap-3">
                    <Pressable
                        onPress={handleTakePicture}
                        className="flex-1 rounded-xl bg-neutral-800 py-4"
                    >
                        <Text className="text-center text-lg font-semibold text-white">사진 첨부</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleSubmit(onSubmit)}
                        className="flex-1 rounded-xl bg-btn py-4"
                    >
                        <Text className="text-center text-lg font-semibold text-white">요금 청구</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}
