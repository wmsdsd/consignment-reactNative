import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function PricesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: '요금 목록',
          headerLeft: () => <DrawerToggleButton tintColor="#ffffff" />,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { color: '#ffffff' },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: '요금 상세',
          headerBackVisible: true,
          headerLeft: undefined, // Stack의 기본 뒤로가기 버튼 사용
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { color: '#ffffff' },
        }}
      />
      <Stack.Screen
        name="[id]/bill"
        options={{
          headerShown: true,
          title: '요금 청구',
          headerBackVisible: true,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { color: '#ffffff' },
        }}
      />
    </Stack>
  );
}
