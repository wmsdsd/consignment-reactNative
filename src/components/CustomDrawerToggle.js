import { DrawerToggleButton } from '@react-navigation/drawer';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerToggle({ onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={{ paddingHorizontal: 12, paddingVertical: 8 }}
        >
            <Ionicons name="menu" size={26} color="#fff" />
        </Pressable>
    )
}
