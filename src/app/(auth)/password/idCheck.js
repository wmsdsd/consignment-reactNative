import { View, Text } from 'react-native';

export default function idCheckScreen() {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
            }}
        >
            <Text>사용자 아이디를 입력해 주세요.</Text>
        </View>
    );
}

export const options = {
    headerTitle: "",
    headerStyle: {
        backgroundColor: '#000000',
    }
}