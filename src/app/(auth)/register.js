import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function registerPage() {
    
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
            }}
        >
            <Text>회원가입을 위해</Text>
            <Text>정보를 입력해 주세요.</Text>
        </View>
    );
}
