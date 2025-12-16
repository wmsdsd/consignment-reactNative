import {  TouchableOpacity, View, Image } from 'react-native'

export default function ImageThumbnail ({ item, onRemove }) {
    const url = item
        ? item.url
            ? item.url.includes("?")
                ? item.url.split("?")[0]
                : item.url
            : null
        : null

    return (
        <View className={"p-[6px] aspect-1 w-[100px] h-[100px]"}>
            {item ? (
                <View className={"border border-[#444] flex-1 rounded-2xl border-dashed"}>
                    <Image
                        className={"flex-1 rounded-lg"}
                        source={{ uri: url }}
                        resizeMode={"contain"}
                    />
                    <TouchableOpacity
                        className={"absolute top-[-10px] right-[-10px] rounded-lg w-6 h-6 items-center justify-center"}
                        onPress={() => onRemove(item.key, item.uid)}
                    >
                        <Image source={require("@assets/icon/ic_close.png")} className={"w-4 h-4"} />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity className={"flex-1 border border-[#444] rounded-2xl border-dashed justify-center items-center"}>
                    <Image source={require("@assets/images/sample/sample_thumbnail.png")} className={"w-8 h-8"} />
                </TouchableOpacity>
            )}
        </View>
    )
}
