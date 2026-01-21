import { TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { Image } from 'expo-image'

export default function ImageThumbnail ({ item, onRemove, onPressEmpty }) {
    const [loading, setLoading] = useState(true)
    const url = item
        ? item.url
            ? item.url.includes("?")
                ? item.url.split("?")[0]
                : item.url
            : null
        : null

    const onTouchEmpty = () => {
        if (onPressEmpty && typeof onPressEmpty === "function") {
            onPressEmpty()
        }
    }

    const resizeImage = (url, size = 400) =>
        `${url}?w=${size}`

    return (
        <View className="p-[6px] w-[100px] h-[100px]">
            <View
                className="relative"
                style={{
                    width: "100%",
                    height: '100%'
                }}
            >
                {/* 이미지 영역 */}
                <View
                    className="border border-[#444] rounded-2xl border-dashed"
                    style={{
                        width: "100%",
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    {loading && (
                        <ActivityIndicator
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                            color="#fff"
                        />
                    )}

                    <Image
                        source={{ uri: resizeImage(url) }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        onError={() => setLoading(false)}
                    />
                </View>

                {/* close 버튼 */}
                <TouchableOpacity
                    onPress={() => onRemove(item.key, item.uid)}
                    style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 20,
                        height: 20,
                        borderRadius: 12,
                        backgroundColor: 'transparent',
                        zIndex: 50,
                        elevation: 10,
                    }}
                >
                    <Image
                        source={require('assets/icon/ic_close.png')}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}
