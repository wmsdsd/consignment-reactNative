import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function TaksongsLayout() {
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
          title: '탁송 목록',
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
          title: '탁송 상세',
          headerBackVisible: true,
          headerLeft: undefined, // Stack의 기본 뒤로가기 버튼 사용
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { color: '#ffffff' },
        }}
      />
      <Stack.Screen
        name="[id]/confirm"
        options={{
          headerShown: true,
          title: '예약 완료',
          headerBackVisible: true,
          headerLeft: undefined, // Stack의 기본 뒤로가기 버튼 사용
          headerRight: () => <DrawerToggleButton tintColor="#ffffff" />,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { color: '#ffffff' },
        }}
      />
      <Stack.Screen
        name="[id]/prepare"
        options={{
          headerShown: true,
          title: '차량 도착',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="[id]/prepare/camera-guide"
        options={{
          headerShown: true,
          title: '촬영 안내',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="[id]/prepare/camera"
        options={{
          headerShown: true,
          title: '사진 촬영',
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
