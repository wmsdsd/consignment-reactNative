import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function verificationScreen() {
    const { text } = useLocalSearchParams()
    
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
            }}
        >
            <Text>{ text }을 위해</Text>
            <Text>본인인증을 해주세요.</Text>
        </View>
    );
}
