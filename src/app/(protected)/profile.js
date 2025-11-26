// app/(protected)/profile.js
import { View, Text } from 'react-native';

export default function ProfileScreen() {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
            }}
        >
            <Text>👤 프로필</Text>
        </View>
    );
}
