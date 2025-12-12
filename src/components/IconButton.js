import { Pressable, Image } from "react-native";

export default function IconButton({
    onPress,
    name
}) {
    const icons = {
        location: require('@assets/icon/ic_location.png'),
        call: require('@assets/icon/ic_call.png'),
        camera: require('@assets/icon/ic_camera.png'),
    }
    
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 16
            })}
            className={'flex justify-center items-center rounded-md'}
        >
            <Image
                source={icons[name]}
                style={{ width: 32, height: 32 }}
            />
        </Pressable>
    );
}
