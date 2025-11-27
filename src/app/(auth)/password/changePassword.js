import { View, Text } from 'react-native';

export default function changePasswordScreen() {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
            }}
        >
            <Text>비밀번호를</Text>
            <Text>변경해 주세요.</Text>
        </View>
    );
}
