// app/(protected)/_layout.js
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProtectedLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-black">
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerType: 'front',
          drawerStyle: { width: 260, backgroundColor: '#1E1E1E' },
          drawerActiveTintColor: '#ffffff',
          drawerInactiveTintColor: '#888888',
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { color: '#ffffff' },
          contentStyle: { backgroundColor: '#000000' },
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: '홈',
            title: '홈',
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: '프로필',
            title: '프로필',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: '설정',
            title: '설정',
          }}
        />
        <Drawer.Screen
          name="taksongs"
          options={{
            drawerLabel: '탁송 목록',
            title: '탁송 목록',
            headerShown: false, // Stack이 자체 헤더를 관리하므로 Drawer 헤더 숨김
          }}
        />
        <Drawer.Screen
          name="prices"
          options={{
            drawerLabel: '요금 목록',
            title: '요금 목록',
            headerShown: false, // Stack이 자체 헤더를 관리하므로 Drawer 헤더 숨김
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
