// app/(protected)/settings.js
import { View, Text } from 'react-native';

export default function SettingsScreen() {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
            }}
        >
            <Text>⚙️ 설정 화면</Text>
        </View>
    );
}
