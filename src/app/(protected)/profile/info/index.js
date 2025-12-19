import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    Pressable,
    ToastAndroid,
    TextInput, ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import React, { useCallback, useEffect, useState } from 'react';
import { useDriverPhotoRemove, useDriverPhotoUpload, useDriverProfile, useDriverUpdate } from '@/hooks/useApi';
import KeyboardWrapper from "@/components/KeyboardWrapper";
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker'
import { Platform } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet';
import { extractS3KeyFromUrl, isFileUnder2MB } from '@/lib/utils';
import { uriToFileObject } from '@/lib/uriToFile';
import { isAndroid } from '@/lib/platform';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getCameraPermissions, getGalleryPermissions } from '@/lib/permissions';

export default function MyInfoScreen() {
    const { edit } = useLocalSearchParams()
    const { logout, user } = useAuth()
    const { data: driver, refetch: refetchDriver } = useDriverProfile(user?.uid)
    const { showActionSheetWithOptions } = useActionSheet()

    const uploadMutation = useDriverPhotoUpload()
    const removeMutation = useDriverPhotoRemove()
    const updateMutation = useDriverUpdate()

    const [isUploading, setIsUploading] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm()

    const openSheet = () => {
        const options = ['사진 찍기', '갤러리 선택', '취소']
        const cancelButtonIndex = 2

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async buttonIndex => {
                if (buttonIndex === 0) {
                    await onTakePicture()
                }
                if (buttonIndex === 1) {
                    await onPickGallery()
                }
            }
        )
    }
    const requestPermission = async (type) => {
        const status =
            type === 'camera'
                ? await getCameraPermissions()
                : await getGalleryPermissions()

        return status === 'granted'
    }

    const removeProfileImage = () => {
        Alert.alert(
            '프로필 이미지 삭제',
            '프로필 이미지를 삭제 하시겠습니까?', [
                { text: '취소', style: 'cancel' },
                {
                    text: '확인',
                    onPress: async () => {
                        const url = driver.profileImage
                        const key = extractS3KeyFromUrl(url)

                        if (key) {
                            const res = await removeMutation.mutateAsync({
                                key: key
                            })
                            if (res) {
                                if (isAndroid) {
                                    ToastAndroid.show("수정 되었습니다.", ToastAndroid.SHORT)
                                }
                                await refetchDriver()
                            }
                        }
                        else {
                            Alert.alert("알림", "이미지 키추출에 실패하였습니다. 관리자에게 문의해주세요.")
                        }
                    },
                },
            ])
    }

    const onTakePicture = async () => {
        const type = "camera"
        const status = await requestPermission(type)
        if (!status) {
            Alert.alert("카메라 권한이 필요합니다.")
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
            allowsEditing: false,
        })

        if (result.canceled) return null

        const uri = result.assets[0].uri
        await onHandleUploadProfileImage(uri, type)
    }

    const onPickGallery = async () => {
        const type = "gallery"
        const status = await requestPermission(type)
        if (!status) {
            Alert.alert("앨범 권한이 필요합니다.")
            return
        }


        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: false,
            selectionLimit: 1,
            quality: 0.8,
        })

        if (result.canceled) return

        const uri = result.assets[0].uri
        await onHandleUploadProfileImage(uri, type)
    }

    const onHandleUploadProfileImage = async (uri, type) => {
        if (!uri) return

        const isUnder = await isFileUnder2MB(uri)
        if (!isUnder) {
            Alert.alert("알림", "파일 크기는 5MB 이하만 가능합니다.")

            if (type === "camera") {
                await onTakePicture()
            }
            else {
                await onPickGallery()
            }
        }
        else {
            try {
                setIsUploading(true)
                const file = await uriToFileObject(uri)
                const driverPhotos = await uploadMutation.mutateAsync({
                    type: "PROFILE",
                    fileList: [
                        {
                            fileName: file.name,
                            fileType: file.type
                        }
                    ]
                })

                if (Array.isArray(driverPhotos) && driverPhotos.length > 0) {
                    const driverPhoto = driverPhotos[0]
                    await fetch(driverPhoto.url, {
                        method: "PUT",
                        headers: {
                            'Content-Type': file.type,
                        },
                        body: file.blob
                    })

                    await refetchDriver()
                    Alert.alert("알림", "프로필 이미지를 등록하였습니다.")
                }
                else {
                    Alert.alert("알림", "이미지 등록에 실패 하였습니다. 네트워크 상태를 확인해 주세요.")
                }
            }
            finally {
                setIsUploading(false)
            }
        }
    }

    const onSubmit = async (data) => {
        const res = await updateMutation.mutateAsync(data)
        if (res) {
            await refetchDriver()

            Alert.alert("수정 되었습니다.")
        }
    }

    const onHandleChangePassword = () => {
        router.push({
            pathname: '/(auth)/changePassword',
            params: {
                phone: driver?.phone,
                root: "(protected)/profile/myInfo"
            }
        })

        // router.push({
        //     pathname: "(protected)/profile/verifyPassword",
        //     params: {
        //         id: driver?.id,
        //         phone: driver?.phone
        //     }
        // })
    }

    const submitComplete = handleSubmit(onSubmit)
    useFocusEffect(
        useCallback(() => {
            if (edit === 'true' || edit === true) {
                submitComplete()
            }
        }, [edit])
    )

    useEffect(() => {
        if (driver) {
            reset({
                ...driver
            })
        }
    }, [])

    return (
        <View className={"flex-1 bg-black p-4"}>
            <KeyboardWrapper>
                <ScrollView>
                    <View className={"relative"}>
                        <Pressable
                            className={"flex justify-center items-center p-4"}
                            onPress={openSheet}
                        >
                            {
                                isUploading
                                ? (<ActivityIndicator color={"#fff"} />)
                                : (
                                    <Image
                                        source={
                                            driver?.profileImage
                                                ? { uri: driver.profileImage }
                                                : require("@assets/ic_profile_default.png")
                                        }
                                        className="w-24 h-24 rounded-lg"
                                    />
                                )
                            }
                        </Pressable>
                        <TouchableOpacity
                            className={"absolute bottom-4 right-10"}
                            onPress={removeProfileImage}
                        >
                            <Text className={"color-gray-400 text-sm"}>프로필 삭제</Text>
                        </TouchableOpacity>
                    </View>
                    <View className={"mb-4 p-4"}>
                        {/* 아이디 */}
                        <View className={"mb-4"}>
                            <Text className={"font-color-label text-sm mb-2"}>아이디</Text>
                            <View className={"flex-row justify-between items-center"}>
                                <View>
                                    <Text className={"font-color text-lg"}>{ driver?.id }</Text>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        className="items-center rounded-lg bg-default p-4"
                                        onPress={onHandleChangePassword}
                                    >
                                        <Text className="text-sm font-semibold text-white">비밀번호 변경</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* 이름 */}
                        <View className="mb-4">
                            <Text className={"font-color-label text-sm mb-2"}>이름</Text>
                            <Controller
                                control={control}
                                name="name"
                                rules={{
                                    required: '이름을 입력해 주세요.',
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                        placeholder="이름"
                                        placeholderTextColor={"#BBBBBB"}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                )}
                            />
                            {errors.name && (
                                <Text className="mb-2 text-sm text-red-500">{errors.name.message}</Text>
                            )}
                        </View>

                        {/* 연락처 */}
                        <View className="mb-4">
                            <Text className={"font-color-label text-sm mb-2"}>연락처</Text>
                            <Controller
                                control={control}
                                name="phone"
                                rules={{
                                    required: '연락처를 입력해주세요.'
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
                            {errors.phone && (
                                <Text className="mb-2 text-sm text-red-500">{errors.phone.message}</Text>
                            )}
                        </View>

                        {/* 이메일 */}
                        <View className="mb-4">
                            <Text className={"font-color-label text-sm mb-2"}>이메일</Text>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="mb-2 rounded-lg border border-color-input bg-input px-4 py-4 text-base"
                                        placeholder="abc@test.com"
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
                    </View>

                    <TouchableOpacity
                        className="items-center rounded-lg bg-default p-4"
                        onPress={logout}
                    >
                        <Text className="text-lg font-semibold text-white">로그아웃</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardWrapper>
        </View>
    )
}
