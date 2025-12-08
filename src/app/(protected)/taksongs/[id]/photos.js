import { View, Text, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router'
import { useEffect, useRef, useState } from 'react';
import { useOrder, useOrderLocationProcess } from '@/hooks/useApi';
import * as ImagePicker from 'expo-image-picker';

const styles = StyleSheet.create({
    /* Tabs */
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingBottom: 10,
    },
    tabItem: {
        paddingVertical: 6,
    },
    activeTabItem: {
        borderBottomWidth: 2,
        borderBottomColor: "#A855F7",
    },
    tabText: {
        color: "#777",
        fontSize: 14,
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "600",
    },

    /* Big Camera Box */
    bigCameraBox: {
        height: 170,
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 12,
        backgroundColor: "#222",
        justifyContent: "center",
        alignItems: "center",
    },
    cameraButton: {
        width: 60,
        height: 60,
        backgroundColor: "#7C3AED",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },

    /* Grid 3×3 */
    gridContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    slotItem: {
        width: "33.33%",
        aspectRatio: 1,
        padding: 6,
    },
    emptySlot: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        flex: 1,
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },

    /* Bottom Button */
    bottomButton: {
        marginTop: 15,
        marginHorizontal: 20,
        backgroundColor: "#7C3AED",
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: "center",
    },
    bottomButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

const tabs = [
    {
        name: "정면",
        key: "FRONT",
        min: 3,
        max: 5,
        sampleImage: require('@assets/images/sample/car_front.png')
    },
    {
        name: "좌측",
        key: "LEFT",
        min: 2,
        max: 5,
        sampleImage: require('@assets/images/sample/car_left.png')
    },
    {
        name: "후면",
        key: "BACK",
        min: 3,
        max: 5,
        sampleImage: require('@assets/images/sample/car_back.png')
    },
    {
        name: "우측",
        key: "RIGHT",
        min: 2,
        max: 5,
        sampleImage: require('@assets/images/sample/car_right.png')
    },
    {
        name: "내부 및 계기판",
        key: "INSIDE",
        min: 3,
        max: 10,
        sampleImage: require('@assets/images/sample/car_inside.png')
    },
    // {
    //     name: "하부",
    //     key: "BOTTOM",
    //     selected: false,
    //     min: 2,
    //     max: 5
    // },
]

export default function CameraScreen() {
    const { id, orderLocationUid } = useLocalSearchParams()
    const { data: order } = useOrder(id)
    const { data: orderLocation } = useOrderLocationProcess(id)

    const [tab, setTab] = useState(tabs[0])
    const [photoList, setPhotoList] = useState({
        FRONT: [],
        LEFT: [],
        BACK: [],
        RIGHT: [],
        INSIDE: [],
    })

    const addPhoto = () => {
        const newPhoto = {
            id: Date.now(),
            uri: "https://images.unsplash.com/photo-1563720223185-11003d516260?w=400", // 임시 이미지
        }

        setPhotoList({
            ...photoList,
            [tab.key]: [...photoList[tab.key], newPhoto],
        })
    }

    const removePhoto = (id) => {
        // Alert.alert('삭제', '이 사진을 삭제하시겠습니까?', [
        //     { text: '취소', style: 'cancel' },
        //     {
        //         text: '삭제',
        //         style: 'destructive',
        //         onPress: () => {
        //             setCapturedImages(prev => prev.filter(img => img.id !== imageId));
        //         },
        //     },
        // ]);

        setPhotoList({
            ...photoList,
            [tab.key]: photoList[tab.key].filter((p) => p.id !== id),
        })
    }

    const renderSlot = ({ item }) => {
        const tabName = tab.key
        return (
            <View className={"p-[6px] aspect-1 w-[33.33%]"}>
                {item ? (
                    <View>
                        <Image
                            className={"flex-1 rounded-lg"}
                            source={{ uri: item.uri }}
                        />
                        <TouchableOpacity
                            className={"absolute top-[-5px] right-[-5px] rounded-lg w-6 h-6 items-center justify-center bg-[rgba(0,0,0,0.7)]"}
                            onPress={() => removePhoto(tabName, item.id)}
                        >
                            {/*<Ionicons name="close" size={16} color="#fff" />*/}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.emptySlot}>
                        {/*<Ionicons name="image-outline" size={24} color="#555" />*/}
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    const selectedPhotos = photoList[tab.key]
    let slots = [...selectedPhotos]

    // 촬영 완료 핸들러
    const handleComplete = async () => {
        // if (capturedImages.length === 0) {
        //     Alert.alert('알림', '최소 한 장 이상의 사진을 촬영해주세요.')
        //     return
        // }
        // setIsLoading(true)
        //
        // try {
        //     // TODO: 사진 업로드 및 촬영 완료 API 호출
        //     Alert.alert('완료', '촬영이 완료되었습니다.', [
        //         {
        //             text: '확인',
        //             onPress: () => {
        //                 router.replace(`/(protected)/taksongs/${id}`);
        //             },
        //         },
        //     ]);
        // } catch (error) {
        //     console.error('촬영 완료 중 오류:', error);
        //     Alert.alert('오류', '촬영 완료 중 오류가 발생했습니다.');
        // } finally {
        //     setIsLoading(false);
        // }
    }

    // 카메라 촬영 핸들러 (플레이스홀더)
    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('알림', "카메라 권한이 필요합니다.")
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            allowsMultipleSelection: true,
            selectionLimit: tab.max,
            quality: 0.8,
        })

        console.log('result', result)

        // // TODO: 실제 카메라 기능 구현
        // // 여기서는 예시로 더미 이미지를 추가합니다
        // Alert.alert('촬영', '카메라 기능을 구현하시겠습니까?', [
        //     { text: '취소', style: 'cancel' },
        //     {
        //         text: '예시 촬영',
        //         onPress: () => {
        //             // 더미 이미지 추가
        //             setCapturedImages(prev => [
        //                 ...prev,
        //                 { id: Date.now(), uri: null }, // 실제로는 촬영한 이미지 URI
        //             ]);
        //             Alert.alert('완료', '사진이 촬영되었습니다. (예시)')
        //         },
        //     },
        // ]);
    }

    return (
        <View className={"bg-black flex-1"}>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {tabs.map((t) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setTab(t)}
                        style={[
                            styles.tabItem,
                            tab.key === t.key && styles.activeTabItem,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                tab.key === t.key && styles.activeTabText,
                            ]}
                        >
                            {t.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Big Camera Area */}
            <View style={styles.bigCameraBox}>
                <TouchableOpacity style={styles.cameraButton} onPress={addPhoto}>
                    {/*<Ionicons name="camera" size={28} color="#fff" />*/}
                </TouchableOpacity>
            </View>

            {/* Grid 3×3 */}
            <FlatList
                data={slots}
                renderItem={renderSlot}
                keyExtractor={(_, index) => index.toString()}
                numColumns={3}
                contentContainerStyle={styles.gridContainer}
            />

            {/* Bottom Button */}
            <TouchableOpacity style={styles.bottomButton}>
                <Text style={styles.bottomButtonText}>촬영 완료</Text>
            </TouchableOpacity>
        </View>
    )
}
