// hooks/useRemovePhoto.js
import { Alert, ToastAndroid, Platform } from "react-native"
import { useOrderPhotoRemove } from '@/hooks/useApi';

export const useRemovePhoto = ({
   photoList,
   setPhotoList,
}) => {

    const removeMutation = useOrderPhotoRemove()

    const removePhoto = (key, uid) => {
        Alert.alert(
            "삭제",
            "이 사진을 삭제하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: async () => {
                        await removeMutation.mutateAsync({ keys: [key] })
                        const list = photoList.filter((item) => item.uid !== uid)

                        if (list.length === 0) list.push(null)
                        setPhotoList(list)

                        if (Platform.OS === "android") {
                            ToastAndroid.show("삭제 되었습니다.", ToastAndroid.SHORT)
                        }
                    },
                },
            ]
        )
    }

    return { removePhoto }
}
