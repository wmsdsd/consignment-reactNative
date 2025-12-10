import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomBackButton({ onPress }) {
    return (
        <Pressable
            onPress={() => {
                if (onPress) onPress()
            }}
            style={{ paddingHorizontal: 12, paddingVertical: 8 }}
        >
            <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
    )
}
